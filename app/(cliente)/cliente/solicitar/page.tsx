import type { Metadata } from "next";
import Button from "@/components/ui/Button";

export const metadata: Metadata = { title: "Solicitar Limpeza" };

export default function SolicitarPage() {
  return (
    <div className="page-container max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-brand-dark mb-2">
        Solicitar limpeza
      </h1>
      <p className="text-brand-muted text-sm mb-8">
        Preencha as informações abaixo e receba orçamentos de técnicos
        certificados na sua região.
      </p>

      <form className="card space-y-5">
        <div>
          <label className="label-base">Quantidade de placas *</label>
          <input
            type="number"
            min={1}
            placeholder="Ex: 12"
            className="input-base"
          />
        </div>

        <div>
          <label className="label-base">Endereço completo *</label>
          <input
            type="text"
            placeholder="Rua, número, bairro"
            className="input-base"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label-base">Cidade *</label>
            <input type="text" placeholder="São Paulo" className="input-base" />
          </div>
          <div>
            <label className="label-base">Estado *</label>
            <select className="input-base">
              <option value="">Selecione</option>
              {["SP", "RJ", "MG", "RS", "PR", "SC", "BA", "GO"].map((uf) => (
                <option key={uf} value={uf}>
                  {uf}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="label-base">Data preferida</label>
          <input type="date" className="input-base" />
        </div>

        <div>
          <label className="label-base">Observações</label>
          <textarea
            rows={3}
            placeholder="Informações adicionais para o técnico..."
            className="input-base resize-none"
          />
        </div>

        <Button type="submit" size="lg" className="w-full">
          Enviar solicitação
        </Button>
      </form>
    </div>
  );
}
