"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Logo from "@/components/layout/Logo";
import Button from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";
import { AlertCircle } from "lucide-react";

const ROLE_REDIRECT: Record<string, string> = {
  cliente: "/cliente",
  tecnico: "/tecnico",
  admin: "/admin",
};

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();

    const { data: authData, error: signInError } =
      await supabase.auth.signInWithPassword({ email, password });

    if (signInError) {
      setLoading(false);
      if (
        signInError.message.includes("Invalid login credentials") ||
        signInError.message.includes("invalid_credentials")
      ) {
        setError("E-mail ou senha incorretos.");
      } else if (signInError.message.includes("Email not confirmed")) {
        setError("Confirme seu e-mail antes de entrar. Verifique sua caixa de entrada.");
      } else {
        setError(signInError.message);
      }
      return;
    }

    // Fetch role from profiles table
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("user_id", authData.user.id)
      .single();

    const role = profile?.role ?? "cliente";
    const destination = ROLE_REDIRECT[role] ?? "/cliente";

    router.push(destination);
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-8">
          <Logo size="lg" />
        </div>

        <div className="card">
          <h1 className="text-xl font-bold text-brand-dark mb-1">
            Entrar na plataforma
          </h1>
          <p className="text-sm text-brand-muted mb-6">
            Bem-vindo de volta! Acesse sua conta.
          </p>

          {error && (
            <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-4">
              <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
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
              <div className="flex items-center justify-between mb-1.5">
                <label className="label-base !mb-0" htmlFor="password">Senha</label>
                <Link
                  href="/recuperar-senha"
                  className="text-xs text-brand-green hover:underline"
                >
                  Esqueceu a senha?
                </Link>
              </div>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                className="input-base"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button type="submit" size="lg" className="w-full mt-2" loading={loading}>
              Entrar
            </Button>
          </form>
        </div>

        <p className="text-center text-sm text-brand-muted mt-6">
          Não tem conta?{" "}
          <Link href="/cadastro" className="text-brand-green font-medium hover:underline">
            Cadastre-se grátis
          </Link>
        </p>
      </div>
    </div>
  );
}
