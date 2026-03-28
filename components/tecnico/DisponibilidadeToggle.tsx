"use client";

import { useState } from "react";

export default function DisponibilidadeToggle({ cidade }: { cidade: string }) {
  const [disponivel, setDisponivel] = useState(true);

  return (
    <button
      onClick={() => setDisponivel((v) => !v)}
      className={`inline-flex items-center gap-2.5 px-4 py-2 rounded-full text-sm font-semibold border transition-all ${
        disponivel
          ? "bg-brand-green/10 border-brand-green/30 text-brand-dark hover:bg-brand-green/20"
          : "bg-red-50 border-red-200 text-red-700 hover:bg-red-100"
      }`}
    >
      <span className="text-base">{disponivel ? "🟢" : "🔴"}</span>
      <span>{disponivel ? "Disponível" : "Offline"}</span>
      <span className="text-xs font-normal opacity-60">· {cidade}</span>
    </button>
  );
}
