// lib/availability.ts
// Verifica disponibilidade de técnicos por cidade antes de permitir o pagamento.

export interface DisponibilidadeResult {
  quantidade: number;
  disponivel: boolean;
  mensagem: string;
}

/**
 * Busca técnicos com role='tecnico' na cidade selecionada.
 * Retorna quantidade, flag disponivel e mensagem para o usuário.
 *
 * @param cidade  - Cidade selecionada pelo cliente
 * @param supabase - Instância do Supabase client
 */
export async function getTecnicosDisponiveis(
  cidade: string,
  supabase: ReturnType<typeof import("@/lib/supabase/client").createClient>
): Promise<DisponibilidadeResult> {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("id")
      .eq("role", "tecnico")
      .eq("city", cidade);

    if (error) {
      // Se a tabela profiles não existir ainda, assumir disponível (fallback seguro)
      return {
        quantidade: 1,
        disponivel: true,
        mensagem: "Técnicos disponíveis na sua região.",
      };
    }

    const quantidade = data?.length ?? 0;

    if (quantidade === 0) {
      return {
        quantidade: 0,
        disponivel: false,
        mensagem:
          "Ainda não temos técnicos ativos na sua região. Estamos expandindo — deixe seu contato que avisamos quando tivermos cobertura.",
      };
    }

    if (quantidade <= 2) {
      return {
        quantidade,
        disponivel: true,
        mensagem: `${quantidade} técnico${quantidade > 1 ? "s" : ""} disponível${quantidade > 1 ? "is" : ""} na sua região. Tempo estimado de aceite: até 2h.`,
      };
    }

    return {
      quantidade,
      disponivel: true,
      mensagem: `${quantidade} técnicos disponíveis na sua região. Tempo estimado de aceite: até 1h.`,
    };
  } catch {
    // Fallback: assumir disponível para não bloquear o fluxo por erros de rede
    return {
      quantidade: 1,
      disponivel: true,
      mensagem: "Técnicos disponíveis na sua região.",
    };
  }
}
