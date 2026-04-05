'use client'
import { useEffect, useRef, useState } from 'react'

type Tecnico = {
  user_id: string
  full_name: string | null
  city: string | null
  cep: string | null
  lat: number | null
  lng: number | null
  last_seen: string | null
  online: boolean
}

type Servico = {
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

type Tab = 'todos' | 'tecnicos' | 'servicos'

const CORRIDOR_CENTER = { lat: -27.0, lng: -48.9 }
const CORRIDOR_ZOOM = 8

const STATUS_LABEL: Record<string, string> = {
  pending:     'Aguardando pagamento',
  accepted:    'Aceito',
  in_progress: 'Em andamento',
  completed:   'Concluído',
  cancelled:   'Cancelado',
}

function formatLastSeen(last_seen: string | null): string {
  if (!last_seen) return 'Nunca acessou'
  const diff = Date.now() - new Date(last_seen).getTime()
  const min = Math.floor(diff / 60000)
  if (min < 1) return 'Agora mesmo'
  if (min < 60) return `${min}min atrás`
  const h = Math.floor(min / 60)
  if (h < 24) return `${h}h atrás`
  return `${Math.floor(h / 24)}d atrás`
}

export function AdminMapaView({
  tecnicos,
  servicos,
}: {
  tecnicos: Tecnico[]
  servicos: Servico[]
}) {
  const mapRef         = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<unknown>(null)
  const [tab, setTab]  = useState<Tab>('todos')

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return

    // Injetar CSS do Leaflet se ainda não estiver presente
    if (!document.querySelector('link[href*="leaflet"]')) {
      const link = document.createElement('link')
      link.rel  = 'stylesheet'
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
      document.head.appendChild(link)
    }

    import('leaflet').then(L => {
      // Corrigir ícones padrão no Next.js
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (L.Icon.Default.prototype as any)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      })

      const map = L.map(mapRef.current!).setView(
        [CORRIDOR_CENTER.lat, CORRIDOR_CENTER.lng],
        CORRIDOR_ZOOM
      )

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
      }).addTo(map)

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(mapInstanceRef as any).current = map

      // ── Pins de técnicos ───────────────────────────────────────────────────
      tecnicos
        .filter(t => t.lat != null && t.lng != null)
        .forEach(t => {
          const color = t.online ? '#3DC45A' : '#ef4444'
          const icon = L.divIcon({
            className: '',
            html: `<div style="
              width:16px;height:16px;
              background:${color};
              border:2.5px solid white;
              border-radius:50%;
              box-shadow:0 1px 4px rgba(0,0,0,0.35);
            "></div>`,
            iconSize:   [16, 16],
            iconAnchor: [8, 8],
          })

          L.marker([t.lat!, t.lng!], { icon })
            .addTo(map)
            .bindPopup(`
              <div style="font-family:'Open Sans',sans-serif;min-width:160px;">
                <div style="font-weight:600;color:#1B3A2D;margin-bottom:2px;">
                  🔧 ${t.full_name ?? 'Sem nome'}
                </div>
                <div style="font-size:12px;color:#666;margin-bottom:6px;">
                  ${t.city ?? '—'}${t.cep ? ` · ${t.cep}` : ''}
                </div>
                <div style="display:flex;align-items:center;gap:6px;font-size:12px;">
                  <span style="width:8px;height:8px;background:${color};border-radius:50%;display:inline-block;"></span>
                  <span style="color:${color};font-weight:500;">${t.online ? 'Online agora' : 'Offline'}</span>
                </div>
                <div style="font-size:11px;color:#999;margin-top:4px;">
                  ${formatLastSeen(t.last_seen)}
                </div>
              </div>
            `)
        })

      // ── Pins de serviços (agrupados por coordenada exata) ─────────────────
      const porCoordenada: Record<string, Servico[]> = {}
      servicos.forEach(s => {
        const key = `${s.latitude.toFixed(5)},${s.longitude.toFixed(5)}`
        if (!porCoordenada[key]) porCoordenada[key] = []
        porCoordenada[key].push(s)
      })

      Object.values(porCoordenada).forEach(grupo => {
        const s          = grupo[0]
        const totalPlacas = grupo.reduce((sum, g) => sum + (g.module_count ?? g.panel_count ?? 0), 0)

        const icon = L.divIcon({
          className: '',
          html: `
            <div style="position:relative;">
              <div style="
                width:16px;height:16px;
                background:#3b82f6;
                border:2.5px solid white;
                border-radius:50%;
                box-shadow:0 1px 4px rgba(0,0,0,0.35);
              "></div>
              ${grupo.length > 1 ? `
                <div style="
                  position:absolute;top:-6px;right:-6px;
                  width:14px;height:14px;
                  background:#1d4ed8;
                  border:1.5px solid white;
                  border-radius:50%;
                  font-size:9px;color:white;
                  display:flex;align-items:center;justify-content:center;
                  font-weight:700;
                ">${grupo.length}</div>
              ` : ''}
            </div>
          `,
          iconSize:   [16, 16],
          iconAnchor: [8, 8],
        })

        const servicosHtml = grupo.map(g => `
          <div style="border-top:1px solid #eee;padding-top:6px;margin-top:6px;font-size:11px;color:#555;">
            ${g.module_count ?? g.panel_count ?? '?'} placas ·
            <span style="color:${
              g.status === 'completed' ? '#3DC45A'
              : g.status === 'cancelled' ? '#ef4444'
              : '#f59e0b'
            }">
              ${STATUS_LABEL[g.status] ?? g.status}
            </span>
            ${g.preferred_date
              ? `· ${new Date(g.preferred_date + 'T00:00:00').toLocaleDateString('pt-BR')}`
              : ''}
          </div>
        `).join('')

        L.marker([s.latitude, s.longitude], { icon })
          .addTo(map)
          .bindPopup(`
            <div style="font-family:'Open Sans',sans-serif;min-width:170px;max-width:220px;">
              <div style="font-weight:600;color:#1B3A2D;margin-bottom:2px;">
                ☀️ ${s.address ?? s.city ?? 'Endereço não informado'}
              </div>
              <div style="font-size:12px;color:#666;margin-bottom:4px;">
                ${grupo.length} serviço${grupo.length > 1 ? 's' : ''} · ${totalPlacas} placas total
              </div>
              ${servicosHtml}
            </div>
          `)
      })
    })

    return () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(mapInstanceRef as any).current?.remove()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(mapInstanceRef as any).current = null
    }
  }, [tecnicos, servicos])

  // ── Lista lateral ──────────────────────────────────────────────────────────
  const tecnicosOrdenados = [
    ...tecnicos.filter(t => t.online && t.lat),
    ...tecnicos.filter(t => !t.online && t.lat),
    ...tecnicos.filter(t => !t.lat),
  ]

  return (
    <div className="space-y-3">
      {/* Legenda */}
      <div className="flex items-center gap-4 flex-wrap text-sm text-brand-muted">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-brand-green inline-block" /> Online
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-red-500 inline-block" /> Offline
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-blue-500 inline-block" /> Serviço
        </span>
      </div>

      {/* Mapa + lista lateral */}
      <div className="flex gap-4 h-[580px] w-full min-w-0">
        {/* Mapa */}
        <div className="flex-1 min-w-0 bg-gray-100 rounded-2xl overflow-hidden border border-brand-border">
          <div ref={mapRef} className="w-full h-full" />
        </div>

        {/* Lista lateral */}
        <div className="w-72 bg-white border border-brand-border rounded-2xl overflow-hidden flex flex-col">
          {/* Tabs */}
          <div className="px-4 py-3 border-b border-gray-100 flex gap-2">
            {(['todos', 'tecnicos', 'servicos'] as const).map(f => (
              <button
                key={f}
                onClick={() => setTab(f)}
                className={`text-xs font-medium px-3 py-1 rounded-full transition-colors ${
                  tab === f
                    ? 'bg-brand-light text-brand-dark'
                    : 'text-brand-muted hover:text-brand-dark'
                }`}
              >
                {f === 'todos' ? 'Todos' : f === 'tecnicos' ? 'Técnicos' : 'Serviços'}
              </button>
            ))}
          </div>

          <div className="overflow-y-auto flex-1 divide-y divide-gray-50">
            {/* Técnicos */}
            {(tab === 'todos' || tab === 'tecnicos') && (
              <>
                {tab === 'todos' && (
                  <p className="px-4 py-2 text-xs font-semibold text-brand-muted uppercase tracking-wide bg-gray-50">
                    Técnicos
                  </p>
                )}
                {tecnicosOrdenados.map(t => (
                  <div
                    key={t.user_id}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-brand-bg transition-colors"
                  >
                    <div className="relative flex-shrink-0">
                      <div className="w-8 h-8 rounded-full bg-brand-light flex items-center justify-center text-brand-dark font-semibold text-xs">
                        {t.full_name?.charAt(0)?.toUpperCase() ?? '?'}
                      </div>
                      <span
                        className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white"
                        style={{ background: !t.lat ? '#d1d5db' : t.online ? '#3DC45A' : '#ef4444' }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-brand-dark truncate">
                        {t.full_name ?? 'Sem nome'}
                      </p>
                      <p className="text-xs text-brand-muted truncate">
                        {t.lat
                          ? `${t.city ?? '—'} · ${formatLastSeen(t.last_seen)}`
                          : 'Sem CEP cadastrado'}
                      </p>
                    </div>
                  </div>
                ))}
                {tecnicos.length === 0 && (
                  <p className="px-4 py-6 text-xs text-brand-muted text-center">Nenhum técnico cadastrado</p>
                )}
              </>
            )}

            {/* Serviços */}
            {(tab === 'todos' || tab === 'servicos') && (
              <>
                {tab === 'todos' && (
                  <p className="px-4 py-2 text-xs font-semibold text-brand-muted uppercase tracking-wide bg-gray-50">
                    Serviços com localização
                  </p>
                )}
                {servicos.slice(0, 30).map(s => (
                  <div
                    key={s.id}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-brand-bg transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm">☀️</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-brand-dark truncate">
                        {s.city ?? 'Cidade não informada'}
                      </p>
                      <p className="text-xs text-brand-muted truncate">
                        {s.module_count ?? s.panel_count ?? '?'} placas · {STATUS_LABEL[s.status] ?? s.status}
                      </p>
                    </div>
                  </div>
                ))}
                {servicos.length === 0 && (
                  <p className="px-4 py-6 text-xs text-brand-muted text-center">Nenhum serviço com pin no mapa</p>
                )}
                {servicos.length > 30 && (
                  <p className="px-4 py-3 text-xs text-brand-muted text-center">
                    +{servicos.length - 30} serviços no mapa
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
