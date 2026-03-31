import Link from "next/link";
import Image from "next/image";

interface LogoProps {
  inverted?: boolean;
  size?: "sm" | "md" | "lg";
}

const sizes = {
  // sm: 40px mobile / 48px desktop
  sm: { text: "text-base", mobileCls: "w-10 h-10", desktopCls: "md:w-12 md:h-12" },
  // md: 40px mobile / 48px desktop
  md: { text: "text-xl",  mobileCls: "w-10 h-10", desktopCls: "md:w-12 md:h-12" },
  // lg: 48px mobile / 52px desktop
  lg: { text: "text-2xl", mobileCls: "w-12 h-12", desktopCls: "md:w-14 md:h-14" },
};

export default function Logo({ inverted = false, size = "md" }: LogoProps) {
  const { text, mobileCls, desktopCls } = sizes[size];

  return (
    <Link href="/" className="flex items-center gap-2.5 group">
      <Image
        src="/logo.jpg"
        alt="Painel Clean"
        width={56}
        height={56}
        className={`flex-shrink-0 rounded-lg object-contain ${mobileCls} ${desktopCls}`}
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
