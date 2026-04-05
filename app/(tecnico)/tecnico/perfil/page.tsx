'use client'

import { useState, useEffect, useCallback } from 'react'
import { User, MapPin, Phone, Mail, Star, CheckCircle2, Edit2, Save, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { MOCK_TECNICO } from '@/lib/mock-data'

type Profile = {
  full_name: string | null
  email: string | null
  phone: string | null
  city: string | null
  cep: string | null
  lat: number | null
  lng: number | null
}

export default function TecnicoPerfilPage() {
  const [profile, setProfile]     = useState<Profile>({ full_name: null, email: null, phone: null, city: null, cep: null, lat: null, lng: null })
  const [editing, setEditing]     = useState(false)
  const [saving, setSaving]       = useState(false)
  const [saveMsg, setSaveMsg]     = useState<{ msg: string; ok: boolean } | null>(null)
  const [userId, setUserId]       = useState<string | null>(null)

  // Edit fields
  const [fullName, setFullName]   = useState('')
  const [phone, setPhone]         = useState('')
  const [city, setCity]           = useState('')
  const [cep, setCep]             = useState('')
  const [lat, setLat]             = useState<number | null>(null)
  const [lng, setLng]             = useState<number | null>(null)

  const load = useCallback(async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    setUserId(user.id)

    const { data } = await supabase
      .from('profiles')
      .select('full_name, phone, city, cep, lat, lng')
      .eq('user_id', user.id)
      .single()

    const p: Profile = {
      full_name: data?.full_name ?? null,
      email:     user.email ?? null,
      phone:     data?.phone ?? null,
      city:      data?.city ?? null,
      cep:       data?.cep ?? null,
      lat:       data?.lat ?? null,
      lng:       data?.lng ?? null,
    }
    setProfile(p)
    setFullName(p.full_name ?? '')
    setPhone(p.phone ?? '')
    setCity(p.city ?? '')
    setCep(p.cep ?? '')
    setLat(p.lat)
    setLng(p.lng)
  }, [])

  useEffect(() => { load() }, [load])

  const handleCEPBlur = async () => {
    const clean = cep.replace(/\D/g, '')
    if (clean.length !== 8) return

    try {
      const res = await fetch(`https://viacep.com.br/ws/${clean}/json/`)
      const data = await res.json()
      if (!data.erro) setCity(data.localidade)

      const { geocodeCEP } = await import('@/lib/geocode')
      const coords = await geocodeCEP(cep)
      if (coords) { setLat(coords.lat); setLng(coords.lng) }
    } catch { /* silently fail */ }
  }

  const showToast = (msg: string, ok: boolean) => {
    setSaveMsg({ msg, ok })
    setTimeout(() => setSaveMsg(null), 3500)
  }

  const handleSave = async () => {
    if (!userId) return
    setSaving(true)
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('profiles')
        .update({ full_name: fullName, phone, city, cep, lat, lng })
        .eq('user_id', userId)

      if (error) throw error
      setProfile(prev => ({ ...prev, full_name: fullName, phone, city, cep, lat, lng }))
      setEditing(false)
      showToast('Perfil atualizado com sucesso!', true)
    } catch {
      showToast('Erro ao salvar. Tente novamente.', false)
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setFullName(profile.full_name ?? '')
    setPhone(profile.phone ?? '')
    setCity(profile.city ?? '')
    setCep(profile.cep ?? '')
    setLat(profile.lat)
    setLng(profile.lng)
    setEditing(false)
  }

  const initials = profile.full_name
    ? profile.full_name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
    : 'T'

  return (
    <div className="page-container max-w-xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-brand-dark">Meu perfil</h1>
          <p className="text-brand-muted text-sm mt-1">Seu desempenho e dados cadastrais</p>
        </div>
        {!editing ? (
          <button
            onClick={() => setEditing(true)}
            className="flex items-center gap-1.5 text-sm font-medium text-brand-dark border border-brand-border rounded-xl px-4 py-2 hover:bg-brand-light transition-colors"
          >
            <Edit2 size={14} /> Editar
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={handleCancel}
              className="flex items-center gap-1.5 text-sm font-medium text-brand-muted border border-brand-border rounded-xl px-3 py-2 hover:bg-brand-light transition-colors"
            >
              <X size={14} /> Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-1.5 text-sm font-medium text-white bg-brand-green rounded-xl px-4 py-2 hover:opacity-90 transition-opacity disabled:opacity-60"
            >
              <Save size={14} /> {saving ? 'Salvando…' : 'Salvar'}
            </button>
          </div>
        )}
      </div>

      {saveMsg && (
        <div className={`text-sm px-4 py-3 rounded-xl font-medium ${
          saveMsg.ok
            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
            : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {saveMsg.msg}
        </div>
      )}

      {/* Avatar + stats */}
      <div className="card flex flex-col items-center gap-4 py-8">
        <div className="h-20 w-20 rounded-full bg-brand-green flex items-center justify-center text-white text-2xl font-bold">
          {initials}
        </div>
        <div className="text-center">
          <p className="font-heading font-bold text-brand-dark text-lg">
            {profile.full_name ?? '—'}
          </p>
          <span className="text-xs bg-brand-light text-brand-dark px-3 py-1 rounded-full font-medium">
            Técnico Certificado ✅
          </span>
        </div>

        <div className="flex items-center gap-6 mt-2">
          <div className="text-center">
            <p className="font-heading font-bold text-brand-dark text-xl">
              {MOCK_TECNICO.avaliacaoMedia.toFixed(1)}
            </p>
            <p className="text-[11px] text-brand-muted flex items-center gap-0.5 justify-center">
              <Star size={10} className="text-amber-400 fill-amber-400" /> Avaliação
            </p>
          </div>
          <div className="w-px h-8 bg-brand-border" />
          <div className="text-center">
            <p className="font-heading font-bold text-brand-dark text-xl">
              {MOCK_TECNICO.servicosMes}
            </p>
            <p className="text-[11px] text-brand-muted">Serviços/mês</p>
          </div>
          <div className="w-px h-8 bg-brand-border" />
          <div className="text-center">
            <p className="font-heading font-bold text-brand-green text-xl">
              {MOCK_TECNICO.tempoMedio}h
            </p>
            <p className="text-[11px] text-brand-muted">Tempo médio</p>
          </div>
        </div>
      </div>

      {/* Dados cadastrais */}
      <div className="card space-y-4">
        <h2 className="font-heading font-bold text-brand-dark text-sm">Dados cadastrais</h2>

        {!editing ? (
          <div className="space-y-3">
            {[
              { icon: User,   label: 'Nome completo',      value: profile.full_name ?? '—'         },
              { icon: Mail,   label: 'E-mail',              value: profile.email ?? '—'             },
              { icon: Phone,  label: 'Telefone',            value: profile.phone ?? 'Não informado' },
              { icon: MapPin, label: 'Cidade de atuação',  value: profile.city ?? 'Não informada'  },
              { icon: MapPin, label: 'CEP',                value: profile.cep
                  ? `${profile.cep}${profile.lat ? ' · ✓ Localizado' : ''}`
                  : 'Não informado'
              },
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
        ) : (
          <div className="space-y-4">
            {/* Nome */}
            <div>
              <label className="block text-sm font-medium text-brand-dark mb-1">Nome completo</label>
              <input
                type="text"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                placeholder="Seu nome completo"
                className="w-full border border-brand-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green"
              />
            </div>

            {/* E-mail (read-only) */}
            <div>
              <label className="block text-sm font-medium text-brand-dark mb-1">E-mail</label>
              <input
                type="email"
                value={profile.email ?? ''}
                disabled
                className="w-full border border-brand-border rounded-lg px-3 py-2 text-sm bg-brand-bg text-brand-muted cursor-not-allowed"
              />
            </div>

            {/* Telefone */}
            <div>
              <label className="block text-sm font-medium text-brand-dark mb-1">Telefone</label>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="(47) 99999-0000"
                className="w-full border border-brand-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green"
              />
            </div>

            {/* Cidade */}
            <div>
              <label className="block text-sm font-medium text-brand-dark mb-1">Cidade de atuação</label>
              <input
                type="text"
                value={city}
                onChange={e => setCity(e.target.value)}
                placeholder="Jaraguá do Sul"
                className="w-full border border-brand-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green"
              />
            </div>

            {/* CEP */}
            <div>
              <label className="block text-sm font-medium text-brand-dark mb-1">CEP</label>
              <input
                type="text"
                value={cep}
                onChange={e => setCep(e.target.value.replace(/(\d{5})(\d)/, '$1-$2'))}
                onBlur={handleCEPBlur}
                placeholder="00000-000"
                maxLength={9}
                className="w-full border border-brand-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green"
              />
              {lat && lng ? (
                <p className="text-xs text-brand-green mt-1">✓ Localização encontrada — você aparecerá no mapa de cobertura</p>
              ) : cep.replace(/\D/g, '').length === 8 ? (
                <p className="text-xs text-brand-muted mt-1">Saindo do campo para geocodificar…</p>
              ) : null}
            </div>
          </div>
        )}
      </div>

      {/* Certificação */}
      <div className="flex items-center gap-3 bg-brand-green/10 border border-brand-green/30 rounded-2xl px-5 py-4">
        <CheckCircle2 size={20} className="text-brand-green flex-shrink-0" />
        <div>
          <p className="font-semibold text-brand-dark text-sm">Treinamento Painel Clean</p>
          <p className="text-xs text-brand-muted mt-0.5">100% concluído · Certificado válido</p>
        </div>
      </div>
    </div>
  )
}
