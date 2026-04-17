import Link from "next/link";
import Image from "next/image";

interface LogoProps {
  inverted?: boolean;
  size?: "sm" | "md" | "lg";
}

const sizes = {
  sm: { titleCls: "text-[18px] md:text-[22px]", subtitleCls: "text-[11px]", mobileCls: "w-8 h-8", desktopCls: "md:w-10 md:h-10" },
  md: { titleCls: "text-[18px] md:text-[22px]", subtitleCls: "text-[11px]", mobileCls: "w-8 h-8", desktopCls: "md:w-10 md:h-10" },
  lg: { titleCls: "text-[22px] md:text-[26px]", subtitleCls: "text-[11px]", mobileCls: "w-10 h-10", desktopCls: "md:w-12 md:h-12" },
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
          Limpeza e cuidado para usinas solares
        </span>
      </div>
    </Link>
  );
}
