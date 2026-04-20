import Link from "next/link";

export default function CTAFinal() {
  return (
    <section
      style={{
        background: "#1B3A2D",
        padding: "clamp(72px, 9vw, 110px) 0",
      }}
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

        <p
          className="uppercase tracking-widest mb-4"
          style={{ fontSize: "11px", letterSpacing: "0.1em", fontWeight: 600, color: "#3DC45A" }}
        >
          🎁 Oferta de entrada
        </p>

        <h2
          className="font-heading font-extrabold animate-on-scroll"
          style={{
            fontSize: "clamp(2rem, 5vw, 3rem)",
            letterSpacing: "-0.02em",
            lineHeight: 1.15,
            color: "white",
            marginBottom: "1.25rem",
          }}
        >
          Assine hoje e ganhe{" "}
          <span style={{ color: "#3DC45A" }}>50% off na 1ª limpeza</span>
        </h2>

        <p
          className="animate-on-scroll"
          style={{
            fontSize: "1.15rem",
            color: "rgba(255,255,255,0.7)",
            marginBottom: "2.5rem",
            lineHeight: 1.6,
          }}
        >
          Plano anual com 2 meses grátis. Técnico certificado agenda em até 48h.
        </p>

        <div
          className="flex flex-col sm:flex-row gap-4 justify-center animate-on-scroll"
          style={{ maxWidth: 480, margin: "0 auto" }}
        >
          <Link
            href="/cadastro"
            className="font-heading font-bold text-sm px-8 py-4 rounded-xl hover:-translate-y-px hover:scale-[1.01] hover:shadow-[0_4px_24px_rgba(61,196,90,0.45)] active:scale-[0.98]"
            style={{
              background: "#3DC45A",
              color: "#1B3A2D",
              transition: "transform 150ms ease-out, box-shadow 150ms ease-out",
              textAlign: "center",
            }}
          >
            Escolher meu plano →
          </Link>

          <Link
            href="/cadastro"
            className="font-heading font-bold text-sm px-8 py-4 rounded-xl hover:-translate-y-px hover:bg-white/10 active:scale-[0.98]"
            style={{
              border: "1px solid rgba(255,255,255,0.25)",
              color: "rgba(255,255,255,0.85)",
              transition: "background 150ms ease-out, transform 150ms ease-out",
              textAlign: "center",
            }}
          >
            Solicitar limpeza avulsa
          </Link>
        </div>

        <p
          className="mt-6 animate-on-scroll"
          style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)" }}
        >
          Cancele a qualquer momento após o período mínimo de 12 meses.
        </p>

      </div>
    </section>
  );
}
