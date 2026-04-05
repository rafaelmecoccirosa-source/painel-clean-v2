/**
 * CEP → lat/lng via ViaCEP + Nominatim (ambos gratuitos, sem API key).
 */
export async function geocodeCEP(cep: string): Promise<{ lat: number; lng: number } | null> {
  try {
    const clean = cep.replace(/\D/g, '')
    if (clean.length !== 8) return null

    const viaCep = await fetch(`https://viacep.com.br/ws/${clean}/json/`)
    const addr = await viaCep.json()
    if (addr.erro) return null

    const query = [addr.logradouro, addr.bairro, addr.localidade, addr.uf, 'Brasil']
      .filter(Boolean).join(', ')

    const nom = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`,
      { headers: { 'User-Agent': 'PainelCleanPlataforma/1.0' } }
    )
    const results = await nom.json()
    if (!results.length) return null

    return { lat: parseFloat(results[0].lat), lng: parseFloat(results[0].lon) }
  } catch {
    return null
  }
}
