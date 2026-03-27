import type { Metadata } from "next";
import Link from "next/link";
import Logo from "@/components/layout/Logo";
import Button from "@/components/ui/Button";

export const metadata: Metadata = { title: "Entrar" };

export default function LoginPage() {
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

          <form className="space-y-4">
            <div>
              <label className="label-base">E-mail</label>
              <input
                type="email"
                placeholder="seu@email.com"
                className="input-base"
                autoComplete="email"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="label-base !mb-0">Senha</label>
                <Link
                  href="/recuperar-senha"
                  className="text-xs text-brand-green hover:underline"
                >
                  Esqueceu a senha?
                </Link>
              </div>
              <input
                type="password"
                placeholder="••••••••"
                className="input-base"
                autoComplete="current-password"
              />
            </div>

            <Button type="submit" size="lg" className="w-full mt-2">
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
