import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { User, MapPin, Phone, Mail, Star, CheckCircle2 } from "lucide-react";
import { MOCK_TECNICO } from "@/lib/mock-data";

export const metadata: Metadata = { title: "Meu Perfil — Técnico" };

export default async function TecnicoPerfilPage() {
  let profile: { full_name?: string; email?: string; phone?: string; city?: string } = {};

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase
        .from("profiles")
        .select("full_name, phone, city")
        .eq("user_id", user.id)
        .single();
      profile = { ...data, email: user.email };
    }
  } catch { /* silently fail */ }

  const initials = profile.full_name
    ? profile.full_name.split(" ").map((n: string) => n[0]).slice(0, 2).join("").toUpperCase()
    : "T";

  return (
    <div className="page-container max-w-xl space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-brand-dark">Meu perfil</h1>
        <p className="text-brand-muted text-sm mt-1">Seu desempenho e dados cadastrais</p>
      </div>

      {/* Avatar + stats */}
      <div className="card flex flex-col items-center gap-4 py-8">
        <div className="h-20 w-20 rounded-full bg-brand-green flex items-center justify-center text-white text-2xl font-bold">
          {initials}
        </div>
        <div className="text-center">
          <p className="font-heading font-bold text-brand-dark text-lg">
            {profile.full_name ?? "—"}
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

      {/* Info */}
      <div className="card space-y-4">
        <h2 className="font-heading font-bold text-brand-dark text-sm">Dados cadastrais</h2>
        <div className="space-y-3">
          {[
            { icon: User,   label: "Nome completo",  value: profile.full_name ?? "—" },
            { icon: Mail,   label: "E-mail",          value: profile.email ?? "—" },
            { icon: Phone,  label: "Telefone",        value: profile.phone ?? "Não informado" },
            { icon: MapPin, label: "Cidade de atuação", value: profile.city ?? "Não informada" },
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

      {/* Certificação */}
      <div className="flex items-center gap-3 bg-brand-green/10 border border-brand-green/30 rounded-2xl px-5 py-4">
        <CheckCircle2 size={20} className="text-brand-green flex-shrink-0" />
        <div>
          <p className="font-semibold text-brand-dark text-sm">Treinamento Painel Clean</p>
          <p className="text-xs text-brand-muted mt-0.5">100% concluído · Certificado válido</p>
        </div>
      </div>

      <p className="text-xs text-brand-muted text-center">
        Para editar seus dados, entre em contato com o suporte.
      </p>
    </div>
  );
}
