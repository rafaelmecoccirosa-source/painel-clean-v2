// === CONSTANTES DE PRECIFICAÇÃO ===
export const PRECO_POR_PLACA = 15; // R$ por placa
export const PRECO_MINIMO = 250; // Preço base mínimo
export const CUSTO_KM = 2; // R$ por km de deslocamento
export const BOOST_MVP = 1.15; // 15% de boost para garantir aceitação no MVP
export const PISO_VALOR_POR_PLACA = 10; // Valor mínimo por placa (proteção contra corrida ruim)

// === TIPOS ===
export type TipoInstalacao = "solo" | "telhado_padrao" | "telhado_dificil";
export type NivelSujeira = "normal" | "pesada";
export type NivelAcesso = "normal" | "dificil";

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
  detalhe: {
    baseCalculo: string;
    tipoLabel: string;
    extras: string[];
  };
}

// === MULTIPLICADORES ===
export function getMultiplicadorTipo(tipo: TipoInstalacao): number {
  switch (tipo) {
    case "solo": return 1.0;
    case "telhado_padrao": return 1.25;
    case "telhado_dificil": return 1.5;
  }
}

export function getLabelTipo(tipo: TipoInstalacao): string {
  switch (tipo) {
    case "solo": return "Solo (acesso fácil)";
    case "telhado_padrao": return "Telhado padrão";
    case "telhado_dificil": return "Telhado difícil / alto";
  }
}

// === ALGORITMO PRINCIPAL ===
export function calcularPreco(dados: DadosServico): ResultadoPrecificacao {
  // 1. Preço base
  const precoBase = Math.max(PRECO_MINIMO, dados.placas * PRECO_POR_PLACA);

  // 2. Multiplicador de tipo de instalação (obrigatório)
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

  // 6. Proteção contra corrida ruim
  const valorPorPlacaReal = precoEstimado / dados.placas;
  if (valorPorPlacaReal < PISO_VALOR_POR_PLACA) {
    const ajuste = (PISO_VALOR_POR_PLACA - valorPorPlacaReal) * dados.placas;
    precoEstimado += ajuste;
  }

  // 7. Boost MVP (garantir aceitação dos técnicos)
  precoEstimado *= BOOST_MVP;
  const boostAplicado = true;

  // 8. Arredondar
  precoEstimado = Math.round(precoEstimado);

  // 9. Faixa exibida
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
    boostAplicado,
    detalhe: {
      baseCalculo: `${dados.placas} placas × R$ ${PRECO_POR_PLACA} = R$ ${dados.placas * PRECO_POR_PLACA} (mín R$ ${PRECO_MINIMO})`,
      tipoLabel: getLabelTipo(dados.tipoInstalacao),
      extras,
    },
  };
}
