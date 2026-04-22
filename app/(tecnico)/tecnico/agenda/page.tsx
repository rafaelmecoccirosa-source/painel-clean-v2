import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import AgendaView, { type AgendaChamado } from './AgendaView';

const STATUS_MAP: Record<string, 'agendado' | 'confirmado' | 'concluido'> = {
  accepted: 'agendado',
  in_progress: 'confirmado',
  completed: 'concluido',
};

const TIME_MAP: Record<string, string> = {
  manha: '08:00',
  tarde: '13:00',
};

export default async function AgendaPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const since = new Date();
  since.setDate(since.getDate() - 90);
  const sinceDate = since.toISOString().split('T')[0];

  const { data: raw } = await supabase
    .from('service_requests')
    .select('id, preferred_date, preferred_time, status, client_id, module_count, address, price_estimate')
    .eq('technician_id', user.id)
    .in('status', ['accepted', 'in_progress', 'completed'])
    .gte('preferred_date', sinceDate)
    .order('preferred_date', { ascending: true });

  const requests = raw ?? [];

  const clientIds = Array.from(
    new Set(requests.map(r => r.client_id).filter(Boolean)),
  ) as string[];
  const cityMap: Record<string, string> = {};
  if (clientIds.length > 0) {
    const { data: profiles } = await supabase
      .from('profiles')
      .select('user_id, city')
      .in('user_id', clientIds);
    (profiles ?? []).forEach(p => { cityMap[p.user_id] = p.city ?? '—'; });
  }

  const chamados: AgendaChamado[] = requests
    .filter(r => r.preferred_date)
    .map(r => ({
      id: r.id,
      data: r.preferred_date as string,
      horario: TIME_MAP[r.preferred_time as string] ?? '08:00',
      status: STATUS_MAP[r.status] ?? 'agendado',
      cidade: r.client_id ? (cityMap[r.client_id] ?? '—') : '—',
      endereco: r.address ?? '—',
      modulos: r.module_count ?? 0,
      valor: Number(r.price_estimate ?? 0),
      duracao: 2,
    }));

  return <AgendaView chamados={chamados} />;
}
