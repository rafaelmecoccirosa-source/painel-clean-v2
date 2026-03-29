import type { Metadata } from "next";
import { Bell, Shield, Smartphone } from "lucide-react";

export const metadata: Metadata = { title: "Configurações — Cliente" };

const secoes = [
  {
    icon: Bell,
    titulo: "Notificações",
    descricao: "Alertas de status do serviço via WhatsApp e e-mail",
    ativo: true,
  },
  {
    icon: Smartphone,
    titulo: "WhatsApp",
    descricao: "Receber atualizações no WhatsApp cadastrado",
    ativo: true,
  },
  {
    icon: Shield,
    titulo: "Privacidade",
    descricao: "Gerenciar seus dados e permissões",
    ativo: false,
  },
];

export default function ConfiguracoesPage() {
  return (
    <div className="page-container max-w-xl space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-brand-dark">Configurações</h1>
        <p className="text-brand-muted text-sm mt-1">Preferências da sua conta</p>
      </div>

      <div className="card space-y-1 !p-0 overflow-hidden">
        {secoes.map(({ icon: Icon, titulo, descricao, ativo }, i) => (
          <div
            key={titulo}
            className={`flex items-center gap-4 px-5 py-4 ${
              i < secoes.length - 1 ? "border-b border-brand-border" : ""
            }`}
          >
            <div className="h-10 w-10 rounded-xl bg-brand-light flex items-center justify-center flex-shrink-0">
              <Icon size={16} className="text-brand-dark" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-brand-dark text-sm">{titulo}</p>
              <p className="text-xs text-brand-muted mt-0.5">{descricao}</p>
            </div>
            <div
              className={`w-10 h-5 rounded-full flex items-center transition-colors flex-shrink-0 ${
                ativo ? "bg-brand-green justify-end" : "bg-brand-border justify-start"
              } px-0.5`}
            >
              <div className="h-4 w-4 rounded-full bg-white shadow-sm" />
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-brand-muted text-center">
        Configurações avançadas estarão disponíveis em breve.
      </p>
    </div>
  );
}
