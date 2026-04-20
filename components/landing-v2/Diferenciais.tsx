const itens = [
  {
    svg: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="10" r="6" stroke="#3DC45A" strokeWidth="2"/>
        <path d="M4 28c0-6.627 5.373-12 12-12s12 5.373 12 12" stroke="#3DC45A" strokeWidth="2" strokeLinecap="round"/>
        <path d="M11 10l3 3 6-6" stroke="#3DC45A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    titulo: "Técnicos certificados",
    texto: "Todos os técnicos passam por treinamento e têm seguro de responsabilidade civil.",
  },
  {
    svg: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="6" y="4" width="20" height="24" rx="3" stroke="#3DC45A" strokeWidth="2"/>
        <rect x="10" y="10" width="7" height="7" rx="1" stroke="#3DC45A" strokeWidth="1.5"/>
        <line x1="19" y1="11" x2="23" y2="11" stroke="#3DC45A" strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="19" y1="14" x2="23" y2="14" stroke="#3DC45A" strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="10" y1="20" x2="23" y2="20" stroke="#3DC45A" strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="10" y1="23" x2="20" y2="23" stroke="#3DC45A" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    titulo: "Relatório fotográfico",
    texto: "Fotos antes e depois de cada limpeza com checklist completo do serviço realizado.",
  },
  {
    svg: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 4L6 8v8c0 5.523 4.477 10 10 10s10-4.477 10-10V8L16 4Z" stroke="#3DC45A" strokeWidth="2"/>
        <path d="M11 16l3 3 7-7" stroke="#3DC45A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    titulo: "Seguro na limpeza",
    texto: "Cobertura contra danos causados durante a execução — equipamentos e estrutura.",
  },
  {
    svg: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="4" y="8" width="24" height="16" rx="3" stroke="#3DC45A" strokeWidth="2"/>
        <circle cx="16" cy="16" r="4" stroke="#3DC45A" strokeWidth="2"/>
        <line x1="4" y1="13" x2="8" y2="13" stroke="#3DC45A" strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="24" y1="19" x2="28" y2="19" stroke="#3DC45A" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    titulo: "Preço transparente",
    texto: "Mensalidade fixa, sem surpresas. Saiba exatamente o que está pagando a cada mês.",
  },
];

export default function Diferenciais() {
  return (
    <section className="bg-white py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 animate-on-scroll">
          <p
            className="text-brand-green uppercase tracking-widest mb-3"
            style={{ fontSize: "11px", letterSpacing: "0.1em", fontWeight: 600 }}
          >
            ⭐ Por que a Painel Clean
          </p>
          <h2
            className="font-heading font-extrabold text-brand-dark"
            style={{ fontSize: "2.5rem", letterSpacing: "-0.02em" }}
          >
            O serviço que sua usina merece
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
          {itens.map(({ svg, titulo, texto }) => (
            <div
              key={titulo}
              className="flex flex-col items-center text-center gap-3 animate-on-scroll"
              style={{ padding: "2rem 1.5rem", border: "1px solid #C8DFC0", borderRadius: "16px" }}
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center"
                style={{ background: "#EBF3E8" }}
              >
                {svg}
              </div>
              <h3 className="font-heading font-bold text-brand-dark text-sm">{titulo}</h3>
              <p className="text-brand-muted text-xs leading-relaxed">{texto}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
