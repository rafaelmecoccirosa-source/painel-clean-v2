import type { Metadata } from "next";
import Link from "next/link";
import Logo from "@/components/layout/Logo";
import Button from "@/components/ui/Button";

export const metadata: Metadata = { title: "Cadastro" };

export default function CadastroPage() {
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

          <form className="space-y-4">
            <div>
              <label className="label-base">Nome completo</label>
              <input
                type="text"
                placeholder="Rafael Mecoci"
                className="input-base"
                autoComplete="name"
              />
            </div>
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
              <label className="label-base">Senha</label>
              <input
                type="password"
                placeholder="Mínimo 8 caracteres"
                className="input-base"
                autoComplete="new-password"
              />
            </div>
            <div>
              <label className="label-base">Tipo de conta</label>
              <select className="input-base">
                <option value="cliente">Cliente — quero limpar minhas placas</option>
                <option value="tecnico">Técnico — quero prestar serviços</option>
              </select>
            </div>

            <Button type="submit" size="lg" className="w-full mt-2">
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
