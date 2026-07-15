import type { Metadata } from "next";
import { Instrument_Serif } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-instrument-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SheetMind — Your Spreadsheets, Supercharged by AI",
  description:
    "Connect Google Sheets and Microsoft Excel. Let AI agents analyze, edit, clean, transform, and automate your spreadsheet workflows."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={instrumentSerif.variable}>
      <body><Providers>{children}</Providers></body>
    </html>
  );
}