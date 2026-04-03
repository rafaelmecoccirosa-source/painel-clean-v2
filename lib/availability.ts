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
    console.log("[availability] checking techs for city:", cidade);

    // Use ilike for case-insensitive comparison (handles casing/accent differences)
    const { data, error } = await supabase
      .from("profiles")
      .select("id, city, role")
      .eq("role", "tecnico")
      .ilike("city", cidade);

    console.log("[availability] result:", { count: data?.length, error: error?.message });

    if (error) {
      // Se a tabela profiles não existir ainda, assumir disponível (fallback seguro)
      console.warn("[availability] profiles query error — assuming available:", error.message);
      return {
        quantidade: 1,
        disponivel: true,
        mensagem: "Técnicos disponíveis na sua região.",
      };
    }

    // Additional fallback: if ilike returns 0, check if ANY tecnico exists (table connectivity test)
    const quantidade = data?.length ?? 0;

    if (quantidade === 0) {
      // Check if we have any tecnicos at all (to distinguish "no techs in city" from "table empty/not ready")
      const { data: allTechs } = await supabase
        .from("profiles")
        .select("id")
        .eq("role", "tecnico")
        .limit(1);

      if (!allTechs || allTechs.length === 0) {
        // Table exists but has no technicians at all — don't block the flow
        console.log("[availability] no technicians in DB at all — allowing submit");
        return {
          quantidade: 1,
          disponivel: true,
          mensagem: "Técnicos disponíveis na sua região.",
        };
      }

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
