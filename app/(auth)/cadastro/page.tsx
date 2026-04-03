"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Logo from "@/components/layout/Logo";
import Button from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";
import { CheckCircle2, AlertCircle } from "lucide-react";

const CIDADES = ["Jaraguá do Sul", "Pomerode", "Florianópolis"];

function CadastroInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [step, setStep] = useState<1 | 2>(1);
  const [role, setRole] = useState<"cliente" | "tecnico" | null>(null);

  // Pre-select role from query param (e.g. /cadastro?role=tecnico)
  useEffect(() => {
    const r = searchParams.get("role");
    if (r === "tecnico" || r === "cliente") {
      setRole(r);
      setStep(2);
    }
  }, [searchParams]);

  // Step 2 fields
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cidade, setCidade] = useState("");
  const [telefone, setTelefone] = useState("");
  const [experiencia, setExperiencia] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);

  const [loading, setLoading] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  function selectRole(r: "cliente" | "tecnico") {
    setRole(r);
    setStep(2);
    setError(null);
  }

  async function handleGoogleSignUp() {
    setLoadingGoogle(true);
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) {
      setError(error.message);
      setLoadingGoogle(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!nome.trim()) return setError("Informe seu nome completo.");
    if (!cidade) return setError("Selecione sua cidade.");
    if (password.length < 8) return setError("A senha deve ter pelo menos 8 caracteres.");
    if (!termsAccepted) return setError("Você precisa aceitar os Termos de Uso para continuar.");

    setLoading(true);

    const supabase = createClient();
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: nome,
          role,
          cidade,
          telefone,
          ...(role === "tecnico" ? { experiencia } : {}),
        },
      },
    });

    if (signUpError) {
      setLoading(false);
      if (signUpError.message.includes("already registered")) {
        setError("Este e-mail já está cadastrado. Tente fazer login.");
      } else {
        setError(signUpError.message);
      }
      return;
    }

    // Manually insert profile (in case the DB trigger isn't set up yet)
    if (signUpData.user) {
      console.log("[cadastro] inserting profile for user:", signUpData.user.id);
      const { error: profileError } = await supabase.from("profiles").upsert({
        user_id: signUpData.user.id,
        full_name: nome,
        role,
        city: cidade,
        phone: telefone,
        email: signUpData.user.email,
      }, { onConflict: "user_id" });
      if (profileError) {
        console.warn("[cadastro] profile upsert warning:", profileError.message);
      }
    }

    setLoading(false);
    setSuccess(true);
    setTimeout(() => router.push("/login"), 3000);
  }

  if (success) {
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
            <h2 className="text-lg font-bold text-brand-dark mb-2">Conta criada!</h2>
            <p className="text-sm text-brand-muted">
              Verifique seu e-mail para confirmar o cadastro. Você será
              redirecionado para o login em instantes.
            </p>
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

        {/* STEP 1 — Role selection */}
        {step === 1 && (
          <div className="card">
            <h1 className="text-xl font-bold text-brand-dark mb-1">Criar conta</h1>
            <p className="text-sm text-brand-muted mb-6">Como você quer usar a plataforma?</p>

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

        {/* STEP 2 — Form */}
        {step === 2 && role && (
          <div className="card">
            <button
              type="button"
              onClick={() => { setStep(1); setError(null); }}
              className="text-xs text-brand-muted hover:text-brand-dark mb-4 flex items-center gap-1"
            >
              ← Voltar
            </button>

            <h1 className="text-xl font-bold text-brand-dark mb-1">
              {role === "cliente" ? "Cadastro de cliente" : "Cadastro de técnico"}
            </h1>
            <p className="text-sm text-brand-muted mb-4">
              {role === "cliente"
                ? "Crie sua conta para agendar serviços."
                : "Crie sua conta para receber chamados na sua cidade."}
            </p>

            {/* Google OAuth */}
            <button
              type="button"
              onClick={handleGoogleSignUp}
              disabled={loadingGoogle}
              className="w-full flex items-center justify-center gap-3 bg-white border border-brand-border hover:border-brand-green hover:bg-brand-light text-brand-dark font-semibold text-sm rounded-xl px-4 py-3 transition-colors mb-4 disabled:opacity-50"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
                <path fill="#4285F4" d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/>
                <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z"/>
                <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/>
                <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/>
              </svg>
              {loadingGoogle ? "Redirecionando…" : "Continuar com Google"}
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-px bg-brand-border" />
              <span className="text-xs text-brand-muted">ou</span>
              <div className="flex-1 h-px bg-brand-border" />
            </div>

            {error && (
              <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-4">
                <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label-base" htmlFor="nome">Nome completo</label>
                <input
                  id="nome"
                  type="text"
                  placeholder="Rafael Mecoci"
                  className="input-base"
                  autoComplete="name"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="label-base" htmlFor="email">E-mail</label>
                <input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  className="input-base"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="label-base" htmlFor="password">Senha</label>
                <input
                  id="password"
                  type="password"
                  placeholder="Mínimo 8 caracteres"
                  className="input-base"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
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

              {role === "tecnico" && (
                <div>
                  <label className="label-base" htmlFor="experiencia">
                    Experiência profissional
                  </label>
                  <textarea
                    id="experiencia"
                    placeholder="Ex: Eletricista há 5 anos, já limpei sistemas solares residenciais e comerciais em Jaraguá do Sul."
                    className="input-base min-h-[80px] resize-y"
                    value={experiencia}
                    onChange={(e) => setExperiencia(e.target.value)}
                  />
                  <p className="text-xs text-brand-muted mt-1">
                    Descreva sua formação e experiência com eletricidade ou energia solar.
                  </p>
                </div>
              )}

              <div className="flex items-start gap-2.5 pt-1">
                <input
                  type="checkbox"
                  id="terms"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="mt-0.5 h-4 w-4 flex-shrink-0 accent-brand-green cursor-pointer"
                />
                <label htmlFor="terms" className="text-sm text-brand-muted cursor-pointer leading-snug">
                  Li e aceito os{" "}
                  <Link href="/termos" target="_blank" className="text-brand-green font-medium hover:underline">
                    Termos de Uso
                  </Link>{" "}
                  da plataforma, incluindo a proibição de contato direto entre clientes e técnicos fora da plataforma.
                </label>
              </div>

              <Button type="submit" size="lg" className="w-full mt-2" loading={loading}>
                Criar conta gratuita
              </Button>
            </form>
          </div>
        )}

        <p className="text-center text-sm text-brand-muted mt-6">
          Já tem conta?{" "}
          <Link href="/login" className="text-brand-green font-medium hover:underline">
            Entrar
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function CadastroPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-brand-bg" />}>
      <CadastroInner />
    </Suspense>
  );
}
