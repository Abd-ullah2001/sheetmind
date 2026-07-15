import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#EA580C",
          hover: "#D44A0A",
          light: "#FFF7ED",
        },
        accent: {
          DEFAULT: "#FDBA74",
          light: "#FED7AA",
        },
        surface: {
          DEFAULT: "#191C21",
          light: "#2A2D35",
          soft: "#F3F4F6",
        },
        "text": {
          primary: "#111827",
          secondary: "#4B5563",
          tertiary: "#9CA3AF",
        },
        border: {
          DEFAULT: "#E5E7EB",
          light: "#F3F4F6",
        },
        success: "#10B981",
        warning: "#F59E0B",
        error: "#EF4444",

        background: "#FFFFFF",
        foreground: "#111827",
        muted: {
          DEFAULT: "#F3F4F6",
          foreground: "#4B5563"
        },
        card: {
          DEFAULT: "#FFFFFF",
          foreground: "#111827"
        },
        destructive: {
          DEFAULT: "#EF4444",
          foreground: "#FFFFFF"
        },
        ring: "#EA580C",
        input: "#E5E7EB"
      },
      fontFamily: {
        geist: ["Geist", "ui-sans-serif", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        serif: ["Instrument Serif", "Georgia", "Times New Roman", "serif"],
        mono: ["JetBrains Mono", "Geist Mono", "ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "monospace"],
        sans: ["Geist", "ui-sans-serif", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"]
      },
      fontSize: {
        caption: ["12px", { lineHeight: "1.2", letterSpacing: "0.02em" }],
        "body-sm": ["14px", { lineHeight: "1.5", letterSpacing: "0.01em" }],
        body: ["16px", { lineHeight: "1.6", letterSpacing: "0" }],
        subheading: ["18px", { lineHeight: "1.4", letterSpacing: "-0.01em" }],
        "heading-sm": ["24px", { lineHeight: "1.3", letterSpacing: "-0.01em" }],
        heading: ["32px", { lineHeight: "1.25", letterSpacing: "-0.02em" }],
        "heading-lg": ["48px", { lineHeight: "1.15", letterSpacing: "-0.02em" }],
        "display-lg": ["64px", { lineHeight: "1.04", letterSpacing: "0" }]
      },
      fontWeight: {
        light: "300",
        regular: "400",
        medium: "500",
        semibold: "600",
        bold: "700"
      },
      spacing: {
        "4": "4px",
        "6": "6px",
        "7": "7px",
        "8": "8px",
        "10": "10px",
        "12": "12px",
        "16": "16px",
        "18": "18px",
        "20": "20px",
        "24": "24px",
        "30": "30px",
        "32": "32px",
        "40": "40px",
        "80": "80px",
        "96": "96px",
        "98": "98px"
      },
      borderRadius: {
        md: "8px",
        lg: "8px",
        xl: "12px",
        "2xl": "16px",
        full: "9999px",
        cards: "8px",
        control: "8px",
        pill: "9999px"
      },
      boxShadow: {
        sm: "0px 1px 2px rgba(0, 0, 0, 0.04)",
        DEFAULT: "0px 1px 3px rgba(0, 0, 0, 0.06), 0px 1px 2px rgba(0, 0, 0, 0.04)",
        md: "0px 4px 6px -1px rgba(0, 0, 0, 0.06), 0px 2px 4px -1px rgba(0, 0, 0, 0.04)",
        lg: "0px 10px 15px -3px rgba(0, 0, 0, 0.08), 0px 4px 6px -2px rgba(0, 0, 0, 0.04)",
        xl: "0px 20px 25px -5px rgba(0, 0, 0, 0.1), 0px 10px 10px -5px rgba(0, 0, 0, 0.04)",
        card: "0px 1px 3px rgba(0, 0, 0, 0.06), 0px 1px 2px rgba(0, 0, 0, 0.04)",
        "card-hover": "0px 10px 15px -3px rgba(0, 0, 0, 0.08), 0px 4px 6px -2px rgba(0, 0, 0, 0.04)",
        subtle: "0 0 0 1px rgba(234, 88, 12, 0.15) inset",
        "landing-sm": "0 2px 8px rgba(0, 0, 0, 0.04)",
        "landing-md": "0 8px 24px rgba(0, 0, 0, 0.06)",
        "landing-lg": "0 16px 48px rgba(0, 0, 0, 0.08)",
        "landing-xl": "0 24px 64px -12px rgba(0, 0, 0, 0.1)"
      },
      maxWidth: {
        page: "1200px",
        landing: "1140px"
      }
    }
  },
  plugins: []
};

export default config;