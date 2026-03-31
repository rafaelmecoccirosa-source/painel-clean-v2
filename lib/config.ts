// ── Feature Flags do MVP ──────────────────────────────────────────────────────
// Todas as flags de configuração ficam aqui. Mudar de false → true ao ativar.

/**
 * SUBSCRIPTION_ENABLED
 * Controla se a assinatura mensal de técnicos está ativa.
 * - false (MVP): cadastro gratuito, só comissão de 15% por serviço
 * - true (futuro): mensalidade ativa + comissão
 */
export const SUBSCRIPTION_ENABLED = false;

/**
 * MVP_PRICING_ACTIVE
 * Quando true, aplica desconto de 15% no preço exibido ao cliente
 * (reduzindo barreira de entrada no lançamento).
 * O repasse ao técnico mantém o BOOST_MVP embutido no cálculo interno.
 * A plataforma absorve a diferença como investimento em liquidez.
 * - true (MVP): precoCliente = precoEstimado × 0.85
 * - false (normal): precoCliente = precoEstimado (sem desconto extra)
 */
export const MVP_PRICING_ACTIVE = true;
