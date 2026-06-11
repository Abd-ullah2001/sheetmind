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
        "aubergine-core": "#611f69",
        "midnight-plum": "#1d1c1d",
        "eggplant-ink": "#2e0039",
        "plum-shadow": "#3d0157",
        "iris-mid": "#730394",
        "lavender-wash": "#f9f0ff",
        "lilac-veil": "#f2defe",
        "iris-edge": "#eac8fe",
        "violet-glow": "#d17dfe",
        "magenta-pulse": "#9602c7",
        "plum-deep": "#481a54",
        "cream-canvas": "#fefbff",
        "pure-white": "#ffffff",
        graphite: "#454245",
        steel: "#696969",
        fog: "#8e8e8e",
        ash: "#edeaed",
        slate: "#808080",
        "ember-to-violet": "#ba01ff",

        border: "var(--color-iris-edge)",
        input: "var(--color-ash)",
        ring: "var(--color-aubergine-core)",
        background: "var(--color-cream-canvas)",
        foreground: "var(--color-midnight-plum)",
        primary: {
          DEFAULT: "var(--color-aubergine-core)",
          foreground: "var(--color-pure-white)"
        },
        muted: {
          DEFAULT: "var(--color-lavender-wash)",
          foreground: "var(--color-steel)"
        },
        accent: {
          DEFAULT: "var(--color-lilac-veil)",
          foreground: "var(--color-midnight-plum)"
        },
        destructive: {
          DEFAULT: "var(--color-magenta-pulse)",
          foreground: "var(--color-pure-white)"
        },
        card: {
          DEFAULT: "var(--color-pure-white)",
          foreground: "var(--color-midnight-plum)"
        }
      },
      fontFamily: {
        "avant-garde": ["Salesforce-Avant-Garde", "ui-sans-serif", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        sans: ["Salesforce-Sans", "ui-sans-serif", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"]
      },
      fontSize: {
        caption: ["12px", { lineHeight: "1.2", letterSpacing: "0.68px" }],
        "body-sm": ["14px", { lineHeight: "1.56", letterSpacing: "0.17px" }],
        body: ["16px", { lineHeight: "1.38", letterSpacing: "0.11px" }],
        subheading: ["18px", { lineHeight: "1.4", letterSpacing: "-0.07px" }],
        "heading-sm": ["24px", { lineHeight: "1.33", letterSpacing: "-0.01px" }],
        heading: ["32px", { lineHeight: "1.25", letterSpacing: "-0.03px" }],
        "heading-lg": ["50px", { lineHeight: "1.2", letterSpacing: "-0.05px" }],
        display: ["76px", { lineHeight: "1.08", letterSpacing: "-0.61px" }]
      },
      fontWeight: {
        light: "300",
        regular: "400",
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
        md: "4px",
        lg: "8px",
        xl: "12px",
        "2xl": "16px",
        full: "48px",
        "full-2": "60px",
        "full-3": "90px",
        tags: "48px",
        cards: "16px",
        pills: "90px",
        inputs: "4px",
        buttons: "4px"
      },
      boxShadow: {
        xl: "rgba(0, 0, 0, 0.1) 0px 0px 32px 0px",
        subtle: "rgb(97, 31, 105) 0px 0px 0px 1px inset",
        lg: "rgba(0, 0, 0, 0.1) 0px 5px 20px 0px"
      },
      maxWidth: {
        page: "1200px"
      },
      gap: {
        section: "96px",
        element: "16px"
      },
      padding: {
        card: "32px"
      }
    }
  },
  plugins: []
};

export default config;
