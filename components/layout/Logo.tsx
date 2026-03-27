import Link from "next/link";

interface LogoProps {
  inverted?: boolean;
  size?: "sm" | "md" | "lg";
}

const sizes = {
  sm: { icon: 28, text: "text-base" },
  md: { icon: 36, text: "text-xl" },
  lg: { icon: 48, text: "text-2xl" },
};

export default function Logo({ inverted = false, size = "md" }: LogoProps) {
  const { icon, text } = sizes[size];

  return (
    <Link href="/" className="flex items-center gap-2.5 group">
      {/* Solar panel icon */}
      <svg
        width={icon}
        height={icon}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
      >
        <rect width="48" height="48" rx="12" fill="#3DC45A" />
        {/* Panel grid */}
        <rect x="8" y="14" width="32" height="20" rx="2" fill="white" fillOpacity="0.15" />
        {/* Grid lines horizontal */}
        <line x1="8" y1="21" x2="40" y2="21" stroke="white" strokeWidth="1.2" strokeOpacity="0.6" />
        <line x1="8" y1="27" x2="40" y2="27" stroke="white" strokeWidth="1.2" strokeOpacity="0.6" />
        {/* Grid lines vertical */}
        <line x1="18.67" y1="14" x2="18.67" y2="34" stroke="white" strokeWidth="1.2" strokeOpacity="0.6" />
        <line x1="29.33" y1="14" x2="29.33" y2="34" stroke="white" strokeWidth="1.2" strokeOpacity="0.6" />
        {/* Shine / clean effect */}
        <path d="M12 18 L16 14" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.9" />
        <path d="M22 18 L26 14" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.9" />
        {/* Base stem */}
        <rect x="22" y="34" width="4" height="4" rx="1" fill="white" fillOpacity="0.8" />
        <rect x="18" y="38" width="12" height="2" rx="1" fill="white" fillOpacity="0.8" />
      </svg>

      <div className="flex flex-col leading-none">
        <span
          className={`font-bold tracking-tight ${text} ${
            inverted ? "text-white" : "text-brand-dark"
          }`}
        >
          Painel<span className="text-brand-green">Clean</span>
        </span>
        <span
          className={`text-[10px] font-medium tracking-widest uppercase ${
            inverted ? "text-white/60" : "text-brand-muted"
          }`}
        >
          Solar
        </span>
      </div>
    </Link>
  );
}
