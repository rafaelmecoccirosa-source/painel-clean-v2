import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { User, MapPin, Phone, Mail } from "lucide-react";

export const metadata: Metadata = { title: "Meu Perfil — Cliente" };

export default async function ClientePerfilPage() {
  let profile: { full_name?: string; email?: string; phone?: string; city?: string } = {};

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const admin = createServiceClient();
      const { data } = await admin
        .from("profiles")
        .select("full_name, phone, city")
        .eq("user_id", user.id)
        .single();
      profile = { ...data, email: user.email };
    }
  } catch { /* silently fail */ }

  const initials = profile.full_name
    ? profile.full_name.split(" ").map((n: string) => n[0]).slice(0, 2).join("").toUpperCase()
    : "U";

  return (
    <div className="page-container max-w-xl space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-brand-dark">Meu perfil</h1>
        <p className="text-brand-muted text-sm mt-1">Suas informações pessoais</p>
      </div>

      {/* Avatar */}
      <div className="card flex flex-col items-center gap-4 py-8">
        <div className="h-20 w-20 rounded-full bg-brand-green flex items-center justify-center text-white text-2xl font-bold">
          {initials}
        </div>
        <div className="text-center">
          <p className="font-heading font-bold text-brand-dark text-lg">
            {profile.full_name ?? "—"}
          </p>
          <span className="text-xs bg-brand-light text-brand-dark px-3 py-1 rounded-full font-medium">
            Cliente
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="card space-y-4">
        <h2 className="font-heading font-bold text-brand-dark text-sm">Dados cadastrais</h2>
        <div className="space-y-3">
          {[
            { icon: User,   label: "Nome completo",  value: profile.full_name ?? "—" },
            { icon: Mail,   label: "E-mail",          value: profile.email ?? "—" },
            { icon: Phone,  label: "Telefone",        value: profile.phone ?? "Não informado" },
            { icon: MapPin, label: "Cidade",          value: profile.city ?? "Não informada" },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-start gap-3 py-2.5 border-b border-brand-border last:border-0">
              <div className="h-8 w-8 rounded-lg bg-brand-light flex items-center justify-center flex-shrink-0">
                <Icon size={14} className="text-brand-dark" />
              </div>
              <div>
                <p className="text-[11px] text-brand-muted">{label}</p>
                <p className="text-sm font-medium text-brand-dark">{value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <p className="text-xs text-brand-muted text-center">
        Para editar seus dados, entre em contato com o suporte.
      </p>
    </div>
  );
}
