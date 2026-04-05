"use client";

import { useState, useEffect, useCallback } from "react";
import { User, MapPin, Phone, Mail, Edit2, Save, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const CIDADES = [
  "Jaraguá do Sul", "Pomerode", "Florianópolis",
  "Blumenau", "Gaspar", "Brusque", "Itajaí",
  "Balneário Camboriú", "Navegantes", "Itapema", "Tijucas", "São José", "Palhoça",
];

type Profile = {
  full_name: string | null;
  email: string | null;
  phone: string | null;
  city: string | null;
};

export default function ClientePerfilPage() {
  const [profile, setProfile] = useState<Profile>({ full_name: null, email: null, phone: null, city: null });
  const [userId, setUserId]   = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving]   = useState(false);
  const [toast, setToast]     = useState<{ msg: string; ok: boolean } | null>(null);

  // Edit fields
  const [fullName, setFullName] = useState("");
  const [phone, setPhone]       = useState("");
  const [city, setCity]         = useState("");

  const showToast = (msg: string, ok: boolean) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3500);
  };

  const load = useCallback(async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    setUserId(user.id);

    const { data } = await supabase
      .from("profiles")
      .select("full_name, phone, city")
      .eq("user_id", user.id)
      .single();

    const p: Profile = {
      full_name: data?.full_name ?? null,
      email:     user.email ?? null,
      phone:     data?.phone ?? null,
      city:      data?.city ?? null,
    };
    setProfile(p);
    setFullName(p.full_name ?? "");
    setPhone(p.phone ?? "");
    setCity(p.city ?? "");
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleSave = async () => {
    if (!userId) return;
    setSaving(true);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("profiles")
        .update({ full_name: fullName.trim(), phone, city })
        .eq("user_id", userId); // SEMPRE user_id, nunca id

      if (error) throw error;
      setProfile(prev => ({ ...prev, full_name: fullName.trim(), phone, city }));
      setEditing(false);
      showToast("Perfil atualizado com sucesso!", true);
    } catch {
      showToast("Erro ao salvar. Tente novamente.", false);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFullName(profile.full_name ?? "");
    setPhone(profile.phone ?? "");
    setCity(profile.city ?? "");
    setEditing(false);
  };

  const initials = profile.full_name
    ? profile.full_name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()
    : "U";

  return (
    <div className="page-container max-w-xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-brand-dark">Meu perfil</h1>
          <p className="text-brand-muted text-sm mt-1">Suas informações pessoais</p>
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
            <button onClick={handleCancel}
              className="flex items-center gap-1.5 text-sm font-medium text-brand-muted border border-brand-border rounded-xl px-3 py-2 hover:bg-brand-light transition-colors">
              <X size={14} /> Cancelar
            </button>
            <button onClick={handleSave} disabled={saving}
              className="flex items-center gap-1.5 text-sm font-medium text-white bg-brand-green rounded-xl px-4 py-2 hover:opacity-90 transition-opacity disabled:opacity-60">
              <Save size={14} /> {saving ? "Salvando…" : "Salvar"}
            </button>
          </div>
        )}
      </div>

      {/* Toast */}
      {toast && (
        <div className={`text-sm px-4 py-3 rounded-xl font-medium ${
          toast.ok
            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
            : "bg-red-50 text-red-700 border border-red-200"
        }`}>
          {toast.msg}
        </div>
      )}

      {/* Avatar */}
      <div className="card flex flex-col items-center gap-4 py-8">
        <div className="h-20 w-20 rounded-full bg-brand-green flex items-center justify-center text-white text-2xl font-bold">
          {initials}
        </div>
        <div className="text-center">
          <p className="font-heading font-bold text-brand-dark text-lg">{profile.full_name ?? "—"}</p>
          <span className="text-xs bg-brand-light text-brand-dark px-3 py-1 rounded-full font-medium">Cliente</span>
        </div>
      </div>

      {/* Dados cadastrais */}
      <div className="card space-y-4">
        <h2 className="font-heading font-bold text-brand-dark text-sm">Dados cadastrais</h2>

        {!editing ? (
          <div className="space-y-3">
            {[
              { icon: User,   label: "Nome completo", value: profile.full_name ?? "—" },
              { icon: Mail,   label: "E-mail",         value: profile.email ?? "—" },
              { icon: Phone,  label: "Telefone",       value: profile.phone ?? "Não informado" },
              { icon: MapPin, label: "Cidade",         value: profile.city ?? "Não informada" },
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
            <div>
              <label className="block text-sm font-medium text-brand-dark mb-1">Nome completo</label>
              <input type="text" value={fullName} onChange={e => setFullName(e.target.value)}
                placeholder="Seu nome completo"
                className="w-full border border-brand-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green" />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-dark mb-1">E-mail</label>
              <input type="email" value={profile.email ?? ""} disabled
                className="w-full border border-brand-border rounded-lg px-3 py-2 text-sm bg-brand-bg text-brand-muted cursor-not-allowed" />
              <p className="text-[11px] text-brand-muted mt-1">O e-mail não pode ser alterado.</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-dark mb-1">Telefone / WhatsApp</label>
              <input type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                placeholder="(47) 99999-0000"
                className="w-full border border-brand-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green" />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-dark mb-1">Cidade</label>
              <select value={city} onChange={e => setCity(e.target.value)}
                className="w-full border border-brand-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green">
                <option value="">Selecione sua cidade</option>
                {CIDADES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
