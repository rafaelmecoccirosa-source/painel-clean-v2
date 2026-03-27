import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: "#1B3A2D",
          green: "#3DC45A",
          bg: "#F4F8F2",
          "dark-hover": "#142C22",
          "green-hover": "#2DAF4A",
          muted: "#6B8F78",
          border: "#C8DEC0",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "gradient-brand":
          "linear-gradient(135deg, #1B3A2D 0%, #2A5C44 100%)",
      },
      boxShadow: {
        card: "0 2px 12px rgba(27, 58, 45, 0.08)",
        "card-hover": "0 8px 24px rgba(27, 58, 45, 0.16)",
      },
    },
  },
  plugins: [],
};

export default config;
