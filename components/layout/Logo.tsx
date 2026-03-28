import Link from "next/link";
import Image from "next/image";

interface LogoProps {
  inverted?: boolean;
  size?: "sm" | "md" | "lg";
}

const sizes = {
  sm: { icon: 32, text: "text-base" },
  md: { icon: 40, text: "text-xl" },
  lg: { icon: 52, text: "text-2xl" },
};

export default function Logo({ inverted = false, size = "md" }: LogoProps) {
  const { icon, text } = sizes[size];

  return (
    <Link href="/" className="flex items-center gap-2.5 group">
      <Image
        src="/logo.jpg"
        alt="Painel Clean"
        width={icon}
        height={icon}
        className="flex-shrink-0 rounded-lg object-contain"
        priority
      />

      <div className="flex flex-col leading-none gap-0.5">
        <span
          className={`font-heading font-bold tracking-tight ${text} ${
            inverted ? "text-white" : "text-brand-dark"
          }`}
        >
          Painel <span className="text-brand-green">Clean</span>
        </span>
        <span
          className={`text-[9px] font-medium tracking-wide ${
            inverted ? "text-white/60" : "text-brand-muted"
          }`}
        >
          Limpeza de Placa Solar
        </span>
      </div>
    </Link>
  );
}
