"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Logo from "@/components/layout/Logo";
import Button from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";
import { CheckCircle2, AlertCircle } from "lucide-react";

export default function CadastroPage() {
  const router = useRouter();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"cliente" | "tecnico">("cliente");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!nome.trim()) return setError("Informe seu nome completo.");
    if (password.length < 8) return setError("A senha deve ter pelo menos 8 caracteres.");
    if (!termsAccepted) return setError("Você precisa aceitar os Termos de Uso para continuar.");

    setLoading(true);

    const supabase = createClient();
    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: nome, role },
      },
    });

    setLoading(false);

    if (signUpError) {
      if (signUpError.message.includes("already registered")) {
        setError("Este e-mail já está cadastrado. Tente fazer login.");
      } else {
        setError(signUpError.message);
      }
      return;
    }

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

        <div className="card">
          <h1 className="text-xl font-bold text-brand-dark mb-1">
            Criar conta
          </h1>
          <p className="text-sm text-brand-muted mb-6">
            Junte-se à plataforma de limpeza solar.
          </p>

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
              <label className="label-base" htmlFor="role">Tipo de conta</label>
              <select
                id="role"
                className="input-base"
                value={role}
                onChange={(e) => setRole(e.target.value as "cliente" | "tecnico")}
              >
                <option value="cliente">Cliente — quero limpar minhas placas</option>
                <option value="tecnico">Técnico — quero prestar serviços</option>
              </select>
            </div>

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
