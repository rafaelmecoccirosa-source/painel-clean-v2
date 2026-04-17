"use client";

import { useState } from "react";

const faqs = [
  {
    pergunta: "Posso cancelar quando quiser?",
    resposta: "Sim, mas o plano tem carência de 12 meses. Se cancelar antes, você paga o saldo devedor do período restante. Limpezas já agendadas e não realizadas não são reembolsadas.",
  },
  {
    pergunta: "O que acontece se eu precisar de uma limpeza extra?",
    resposta: "Se o monitoramento detectar queda de performance, você recebe um alerta no app. Assinantes têm 40% de desconto em limpezas extras em relação ao preço avulso.",
  },
  {
    pergunta: "O seguro cobre o quê?",
    resposta: "O seguro cobre danos causados durante a execução da limpeza — equipamentos danificados pelo técnico, por exemplo. Não é um seguro do ativo solar em si.",
  },
  {
    pergunta: "Em quais cidades vocês atendem?",
    resposta: "Atualmente atendemos Jaraguá do Sul, Pomerode e Florianópolis. Expansão para Blumenau, Itajaí, Brusque e Gaspar prevista para o segundo semestre.",
  },
  {
    pergunta: "Como funciona o relatório mensal?",
    resposta: "Todo mês você recebe um relatório com kWh gerados vs. esperado para sua região, economia estimada na conta de luz e status do próximo agendamento de limpeza.",
  },
  {
    pergunta: "Com quais inversores vocês integram?",
    resposta: "Compatíveis com Fronius, SolarEdge, Growatt, Sungrow, Hoymiles e Deye. A integração automática via API está em desenvolvimento — no MVP o relatório é gerado manualmente pela nossa equipe.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section style={{ background: "#F4F8F2" }} className="py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 animate-on-scroll">
          <p className="text-brand-green uppercase tracking-widest mb-3" style={{ fontSize: "11px", letterSpacing: "0.1em", fontWeight: 600 }}>
            ❓ Dúvidas comuns
          </p>
          <h2 className="font-heading font-extrabold text-brand-dark" style={{ fontSize: "2.5rem", letterSpacing: "-0.02em" }}>
            Perguntas frequentes
          </h2>
        </div>

        <div className="flex flex-col gap-3">
          {faqs.map((faq, idx) => {
            const isOpen = open === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl overflow-hidden"
                style={{ border: `1px solid ${isOpen ? "#3DC45A" : "#C8DFC0"}`, transition: "border-color 0.2s" }}
              >
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between px-6 py-4 text-left"
                >
                  <span className="font-heading font-semibold text-brand-dark text-sm pr-4">
                    {faq.pergunta}
                  </span>
                  <span
                    className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold"
                    style={{
                      background: isOpen ? "#3DC45A" : "#EBF3E8",
                      color: isOpen ? "#ffffff" : "#3DC45A",
                      transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                      transition: "all 0.2s",
                    }}
                  >
                    +
                  </span>
                </button>
                <div
                  style={{
                    maxHeight: isOpen ? "200px" : "0",
                    opacity: isOpen ? 1 : 0,
                    overflow: "hidden",
                    transition: "max-height 300ms ease-in-out, opacity 300ms ease-in-out",
                  }}
                >
                  <div className="px-6 pb-5">
                    <p className="text-brand-muted text-sm leading-relaxed">{faq.resposta}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
