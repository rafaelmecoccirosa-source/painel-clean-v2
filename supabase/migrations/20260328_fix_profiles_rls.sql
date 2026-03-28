-- Fix 1: Add INSERT policy so authenticated users can create their own profile
-- (also covers direct inserts from the client as a fallback)
create policy "Users can insert own profile"
  on profiles for insert with check (auth.uid() = user_id);

-- Fix 2: Rebuild trigger function with:
--   - set search_path = public (Supabase security best practice)
--   - accepts both 'full_name' and 'nome' metadata keys
--   - exception handler so a trigger failure never blocks auth user creation
create or replace function handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (user_id, full_name, role)
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data->>'full_name',
      new.raw_user_meta_data->>'nome',
      new.email
    ),
    coalesce(
      (new.raw_user_meta_data->>'role')::user_role,
      'cliente'
    )
  );
  return new;
exception when others then
  raise warning 'handle_new_user error: %', sqlerrm;
  return new;
end;
$$;
