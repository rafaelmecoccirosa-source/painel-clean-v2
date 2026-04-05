import { createServiceClient } from '@/lib/supabase/service'
import { AdminMapaView } from './AdminMapaView'

export const metadata = { title: 'Mapa de Cobertura — Admin | Painel Clean' }

export default async function AdminMapaPage() {
  const supabase = createServiceClient()

  const [{ data: tecnicos }, { data: servicos }] = await Promise.all([
    supabase
      .from('profiles')
      .select('user_id, full_name, city, cep, lat, lng, last_seen')
      .eq('role', 'tecnico')
      .order('full_name'),
    supabase
      .from('service_requests')
      .select('id, client_id, city, address, module_count, panel_count, status, payment_status, preferred_date, latitude, longitude')
      .not('latitude', 'is', null)
      .not('longitude', 'is', null)
      .order('created_at', { ascending: false }),
  ])

  const agora = new Date()
  const tecnicosComStatus = (tecnicos ?? []).map(t => ({
    ...t,
    online: t.last_seen
      ? (agora.getTime() - new Date(t.last_seen).getTime()) < 5 * 60 * 1000
      : false,
  }))

  const stats = {
    tecnicosOnline:  tecnicosComStatus.filter(t => t.online).length,
    tecnicosOffline: tecnicosComStatus.filter(t => !t.online).length,
    tecnicosSemCEP:  tecnicosComStatus.filter(t => !t.lat).length,
    totalServicos:   servicos?.length ?? 0,
    servicosAtivos:  servicos?.filter(s =>
      ['pending', 'accepted', 'in_progress'].includes(s.status)
    ).length ?? 0,
  }

  return (
    <div className="page-container space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-brand-dark">Mapa de Cobertura</h1>
        <p className="text-brand-muted text-sm mt-1">
          Técnicos e demanda no corredor Jaraguá do Sul → Florianópolis
        </p>
      </div>

      {/* KPIs */}
      <div className="flex gap-3 flex-wrap">
        <div className="bg-white border border-brand-border rounded-xl px-4 py-3 flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-brand-green flex-shrink-0" />
          <span className="font-semibold text-brand-dark">{stats.tecnicosOnline}</span>
          <span className="text-brand-muted text-sm">técnicos online</span>
        </div>
        <div className="bg-white border border-brand-border rounded-xl px-4 py-3 flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-500 flex-shrink-0" />
          <span className="font-semibold text-brand-dark">{stats.tecnicosOffline}</span>
          <span className="text-brand-muted text-sm">offline</span>
        </div>
        <div className="bg-white border border-brand-border rounded-xl px-4 py-3 flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-blue-500 flex-shrink-0" />
          <span className="font-semibold text-brand-dark">{stats.totalServicos}</span>
          <span className="text-brand-muted text-sm">serviços no mapa</span>
        </div>
        <div className="bg-white border border-brand-border rounded-xl px-4 py-3 flex items-center gap-2">
          <span className="font-semibold text-brand-dark">{stats.servicosAtivos}</span>
          <span className="text-brand-muted text-sm">ativos agora</span>
        </div>
        {stats.tecnicosSemCEP > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-3 flex items-center gap-2">
            <span className="text-yellow-600 text-sm">
              ⚠️ {stats.tecnicosSemCEP} técnico{stats.tecnicosSemCEP > 1 ? 's' : ''} sem CEP
            </span>
          </div>
        )}
      </div>

      <AdminMapaView
        tecnicos={tecnicosComStatus}
        servicos={(servicos ?? []) as ServicosItem[]}
      />
    </div>
  )
}

// Re-export type so AdminMapaView can import it
export type ServicosItem = {
  id: string
  client_id: string
  city: string | null
  address: string | null
  module_count: number | null
  panel_count: number | null
  status: string
  payment_status: string
  preferred_date: string | null
  latitude: number
  longitude: number
}
