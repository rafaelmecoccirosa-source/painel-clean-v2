// === FAIXAS DE PREÇO POR PLACA (média do mercado SC) ===
// Economia de escala: quanto mais placas, menor o valor unitário

export function getValorPorPlaca(placas: number): number {
  if (placas <= 30)  return 27.50; // Faixa: R$ 20-35, média R$ 27,50
  if (placas <= 50)  return 20.00; // Faixa: R$ 15-25, média R$ 20,00
  if (placas <= 100) return 14.00; // Faixa: R$ 10-18, média R$ 14,00
  if (placas <= 200) return 9.50;  // Faixa: R$ 7-12, média R$ 9,50
  return 0; // Acima de 200: sob consulta
}

export function getFaixaLabel(placas: number): string {
  if (placas <= 30)  return "Até 30 placas (R$ 20–35/placa)";
  if (placas <= 50)  return "31–50 placas (R$ 15–25/placa)";
  if (placas <= 100) return "51–100 placas (R$ 10–18/placa)";
  if (placas <= 200) return "101–200 placas (R$ 7–12/placa)";
  return "Acima de 200 placas (sob consulta)";
}

// === CONSTANTES DE PRECIFICAÇÃO ===
export const PRECO_POR_PLACA = 15;  // mantido para compatibilidade, não usado no algoritmo principal
export const PRECO_MINIMO = 300;    // Mínimo R$ 300 (ajustado pro mercado SC)
export const CUSTO_KM = 2;          // R$ por km de deslocamento
export const BOOST_MVP = 1.15;      // 15% de boost para garantir aceitação no MVP

// === TIPOS ===
export type TipoInstalacao = "solo" | "telhado_padrao" | "telhado_dificil";
export type NivelSujeira   = "normal" | "pesada";
export type NivelAcesso    = "normal" | "dificil";

export interface DadosServico {
  placas: number;
  tipoInstalacao: TipoInstalacao;
  sujeira: NivelSujeira;
  acesso: NivelAcesso;
  distanciaKm: number;
}

export interface ResultadoPrecificacao {
  precoBase: number;
  multTipo: number;
  multExtra: number;
  custoDeslocamento: number;
  precoEstimado: number;
  precoMin: number;
  precoMax: number;
  valorPorPlaca: number;
  boostAplicado: boolean;
  sobConsulta?: boolean;
  detalhe: {
    baseCalculo: string;
    tipoLabel: string;
    extras: string[];
  };
}

// === MULTIPLICADORES ===
export function getMultiplicadorTipo(tipo: TipoInstalacao): number {
  switch (tipo) {
    case "solo":            return 1.0;
    case "telhado_padrao":  return 1.25;
    case "telhado_dificil": return 1.5;
  }
}

export function getLabelTipo(tipo: TipoInstalacao): string {
  switch (tipo) {
    case "solo":            return "Solo (acesso fácil)";
    case "telhado_padrao":  return "Telhado padrão";
    case "telhado_dificil": return "Telhado difícil / alto";
  }
}

// === ALGORITMO PRINCIPAL ===
export function calcularPreco(dados: DadosServico): ResultadoPrecificacao {
  const valorPorPlaca = getValorPorPlaca(dados.placas);

  // Acima de 200 placas → sob consulta
  if (valorPorPlaca === 0) {
    return {
      precoBase: 0,
      multTipo: 0,
      multExtra: 0,
      custoDeslocamento: 0,
      precoEstimado: 0,
      precoMin: 0,
      precoMax: 0,
      valorPorPlaca: 0,
      boostAplicado: false,
      sobConsulta: true,
      detalhe: {
        baseCalculo: "Acima de 200 placas — sob consulta",
        tipoLabel: getLabelTipo(dados.tipoInstalacao),
        extras: [],
      },
    };
  }

  // 1. Preço base (escala de mercado, mínimo R$ 300)
  const precoBase = Math.max(PRECO_MINIMO, dados.placas * valorPorPlaca);

  // 2. Multiplicador de tipo de instalação
  const multTipo = getMultiplicadorTipo(dados.tipoInstalacao);

  // 3. Multiplicador de extras (aditivo)
  let multExtra = 1.0;
  const extras: string[] = [];
  if (dados.sujeira === "pesada") {
    multExtra += 0.2;
    extras.push("Sujeira pesada (+20%)");
  }
  if (dados.acesso === "dificil") {
    multExtra += 0.2;
    extras.push("Acesso difícil (+20%)");
  }

  // 4. Custo de deslocamento
  const custoDeslocamento = dados.distanciaKm * CUSTO_KM;

  // 5. Preço estimado
  let precoEstimado = precoBase * multTipo * multExtra + custoDeslocamento;

  // 6. Boost MVP (garantir aceitação dos técnicos)
  precoEstimado *= BOOST_MVP;

  // 7. Arredondar
  precoEstimado = Math.round(precoEstimado);

  // 8. Faixa exibida (±10% min, +20% max)
  const precoMin = Math.round(precoEstimado * 0.9);
  const precoMax = Math.round(precoEstimado * 1.2);

  return {
    precoBase,
    multTipo,
    multExtra,
    custoDeslocamento,
    precoEstimado,
    precoMin,
    precoMax,
    valorPorPlaca: Math.round(precoEstimado / dados.placas),
    boostAplicado: true,
    sobConsulta: false,
    detalhe: {
      baseCalculo: `${dados.placas} placas × R$ ${valorPorPlaca.toFixed(2)} = R$ ${(dados.placas * valorPorPlaca).toFixed(0)} (mín R$ ${PRECO_MINIMO})`,
      tipoLabel: getLabelTipo(dados.tipoInstalacao),
      extras,
    },
  };
}
