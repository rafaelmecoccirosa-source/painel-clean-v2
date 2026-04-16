// ── Feature Flags ─────────────────────────────────────────────────────────────

export const SUBSCRIPTION_ENABLED  = true;   // modelo assinatura ativo (v2)
export const AVULSO_ENABLED        = true;   // serviço avulso mantido como secundário
export const INVERTER_API_ENABLED  = false;  // integração API inversores — pós-MVP
export const FIRST_SERVICE_DISCOUNT = 0.50;  // 50% desconto na 1ª limpeza

/**
 * MVP_PRICING_ACTIVE
 * Quando true, aplica desconto de 15% no preço exibido ao cliente
 * (reduzindo barreira de entrada no lançamento).
 */
export const MVP_PRICING_ACTIVE = true;
