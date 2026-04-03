"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Logo from "@/components/layout/Logo";
import Button from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";
import { AlertCircle, CheckCircle2 } from "lucide-react";

const CIDADES = ["Jaraguá do Sul", "Pomerode", "Florianópolis"];

export default function CompletarCadastroPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [role, setRole] = useState<"cliente" | "tecnico" | null>(null);
  const [cidade, setCidade] = useState("");
  const [telefone, setTelefone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  function selectRole(r: "cliente" | "tecnico") {
    setRole(r);
    setStep(2);
    setError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!cidade) return setError("Selecione sua cidade.");

    setLoading(true);

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      setError("Sessão expirada. Faça login novamente.");
      setLoading(false);
      return;
    }

    // Upsert profile
    const { error: upsertError } = await supabase
      .from("profiles")
      .upsert({
        user_id: user.id,
        role,
        city: cidade,
        phone: telefone,
        full_name: user.user_metadata?.full_name ?? user.email?.split("@")[0] ?? "",
        updated_at: new Date().toISOString(),
      }, { onConflict: "user_id" });

    setLoading(false);

    if (upsertError) {
      setError("Erro ao salvar perfil. Tente novamente.");
      return;
    }

    setDone(true);
    setTimeout(() => {
      router.push(role === "tecnico" ? "/tecnico" : "/cliente");
      router.refresh();
    }, 1500);
  }

  if (done) {
    return (
      <div className="min-h-screen bg-brand-bg flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm">
          <div className="flex justify-center mb-8">
            <Logo size="lg" />
          </div>
          <div className="card text-center py-8">
            <div className="flex justify-center mb-4">
              <div className="h-14 w-14 rounded-full bg-brand-green/10 flex items-center justify-center">
                <CheckCircle2 size={32} className="text-brand-green" />
              </div>
            </div>
            <h2 className="text-lg font-bold text-brand-dark mb-2">Perfil criado!</h2>
            <p className="text-sm text-brand-muted">Redirecionando para sua área…</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-8">
          <Logo size="lg" />
        </div>

        {step === 1 && (
          <div className="card">
            <h1 className="text-xl font-bold text-brand-dark mb-1">Completar cadastro</h1>
            <p className="text-sm text-brand-muted mb-6">
              Como você quer usar a plataforma?
            </p>

            <div className="space-y-3">
              <button
                type="button"
                onClick={() => selectRole("cliente")}
                className="w-full text-left border border-brand-border hover:border-brand-green hover:bg-brand-light rounded-xl p-4 transition-colors group"
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl leading-none mt-0.5">🏠</span>
                  <div>
                    <p className="font-bold text-brand-dark text-sm group-hover:text-brand-green transition-colors">
                      Sou cliente
                    </p>
                    <p className="text-xs text-brand-muted mt-0.5 leading-snug">
                      Quero agendar limpeza das minhas placas solares
                    </p>
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => selectRole("tecnico")}
                className="w-full text-left border border-brand-border hover:border-brand-green hover:bg-brand-light rounded-xl p-4 transition-colors group"
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl leading-none mt-0.5">🔧</span>
                  <div>
                    <p className="font-bold text-brand-dark text-sm group-hover:text-brand-green transition-colors">
                      Sou técnico
                    </p>
                    <p className="text-xs text-brand-muted mt-0.5 leading-snug">
                      Quero prestar serviços de limpeza de placas solares
                    </p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        )}

        {step === 2 && role && (
          <div className="card">
            <button
              type="button"
              onClick={() => { setStep(1); setError(null); }}
              className="text-xs text-brand-muted hover:text-brand-dark mb-4 flex items-center gap-1"
            >
              ← Voltar
            </button>

            <h1 className="text-xl font-bold text-brand-dark mb-1">Mais algumas infos</h1>
            <p className="text-sm text-brand-muted mb-4">
              {role === "tecnico"
                ? "Cadastro gratuito — sem mensalidade."
                : "Quase lá! Só precisamos de mais alguns dados."}
            </p>

            {role === "tecnico" && (
              <div className="bg-brand-light border border-brand-border rounded-xl px-4 py-3 mb-4">
                <p className="text-xs font-semibold text-brand-green">
                  Sem mensalidade — apenas 25% de comissão por serviço realizado
                </p>
              </div>
            )}

            {error && (
              <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-4">
                <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label-base" htmlFor="cidade">Cidade</label>
                <select
                  id="cidade"
                  className="input-base"
                  value={cidade}
                  onChange={(e) => setCidade(e.target.value)}
                  required
                >
                  <option value="">Selecione sua cidade</option>
                  {CIDADES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label-base" htmlFor="telefone">Telefone / WhatsApp</label>
                <input
                  id="telefone"
                  type="tel"
                  placeholder="(47) 9 9999-9999"
                  className="input-base"
                  autoComplete="tel"
                  value={telefone}
                  onChange={(e) => setTelefone(e.target.value)}
                />
              </div>

              <Button type="submit" size="lg" className="w-full mt-2" loading={loading}>
                Salvar e continuar
              </Button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
