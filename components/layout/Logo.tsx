import Link from "next/link";
import Image from "next/image";

interface LogoProps {
  inverted?: boolean;
  size?: "sm" | "md" | "lg";
}

const sizes = {
  // sm/md: 40px mobile / 48px desktop icon; 16px→20px title; 11px→13px subtitle
  sm: { titleCls: "text-base md:text-[20px]", subtitleCls: "text-[11px] md:text-[13px]", mobileCls: "w-10 h-10", desktopCls: "md:w-12 md:h-12" },
  md: { titleCls: "text-base md:text-[20px]", subtitleCls: "text-[11px] md:text-[13px]", mobileCls: "w-10 h-10", desktopCls: "md:w-12 md:h-12" },
  // lg: slightly bigger
  lg: { titleCls: "text-[20px] md:text-[22px]", subtitleCls: "text-[13px] md:text-[14px]", mobileCls: "w-12 h-12", desktopCls: "md:w-14 md:h-14" },
};

export default function Logo({ inverted = false, size = "md" }: LogoProps) {
  const { titleCls, subtitleCls, mobileCls, desktopCls } = sizes[size];

  return (
    <Link href="/" className="flex items-center gap-3 group">
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
          className={`font-heading font-bold tracking-tight ${titleCls} ${
            inverted ? "text-white" : "text-brand-dark"
          }`}
        >
          Painel <span className="text-brand-green">Clean</span>
        </span>
        <span
          className={`font-medium tracking-wide ${subtitleCls} ${
            inverted ? "text-white/60" : "text-brand-muted"
          }`}
        >
          Limpeza de Placa Solar
        </span>
      </div>
    </Link>
  );
}
