"use client";

export const dynamic = "force-dynamic";

import { signIn, useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { FileSpreadsheet, LockKeyhole, MessageSquareText, Sparkles, LayoutPanelLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const session = useSession();
  const status = session?.status;

  if (status === "authenticated") redirect("/dashboard");

  return (
    <div className="min-h-screen bg-[var(--color-cream-canvas)]">
      {/* Announcement Banner */}
      <div className="flex items-center justify-center bg-[var(--color-lavender-wash)] px-4 py-[6px]">
        <span className="text-[14px] text-[var(--color-midnight-plum)]">
          New: Natural language formulas &mdash; just ask and SheetMind writes them.
          <a href="#" className="ml-1 font-semibold text-[var(--color-iris-mid)] underline">Learn more</a>
        </span>
      </div>

      {/* Top Navigation Bar */}
      <header className="h-16 border-b border-[var(--color-iris-edge)] bg-[var(--color-pure-white)]/95 backdrop-blur">
        <div className="mx-auto flex h-full max-w-page items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-[4px] bg-[var(--color-aubergine-core)]">
              <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4 text-white">
                <rect x="2" y="2" width="7" height="7" rx="1" fill="currentColor" opacity="0.7" />
                <rect x="11" y="2" width="7" height="7" rx="1" fill="currentColor" />
                <rect x="2" y="11" width="7" height="7" rx="1" fill="currentColor" opacity="0.85" />
                <rect x="11" y="11" width="7" height="7" rx="1" fill="currentColor" opacity="0.55" />
              </svg>
            </span>
            <div className="flex items-baseline gap-1">
              <span className="font-avant-garde text-[18px] font-bold text-[var(--color-midnight-plum)]">SheetMind</span>
              <span className="text-[11px] font-semibold uppercase tracking-[0.057em] text-[var(--color-steel)]">by Noor</span>
            </div>
          </div>
          <nav className="hidden items-center gap-6 md:flex">
            {["Features", "Solutions", "Pricing"].map((item) => (
              <span key={item} className="cursor-pointer text-[15px] text-[var(--color-midnight-plum)] transition-colors hover:text-[var(--color-aubergine-core)]">{item}</span>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <Button variant="ghost-cta" size="md">SIGN IN</Button>
            <Button size="md" onClick={() => signIn("google", { callbackUrl: "/dashboard" })}>GET STARTED</Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="bg-radial-wash pointer-events-none absolute inset-0" />
        <div className="relative mx-auto max-w-page px-4 py-[98px] text-center">
          {/* Floating Pill Tag */}
          <div className="mb-6 inline-flex items-center rounded-[48px] bg-[var(--color-lavender-wash)] px-[16px] py-[6px]">
            <span className="text-[14px] font-semibold text-[var(--color-midnight-plum)]">Knowledge &bull; People &bull; Process</span>
          </div>

          <h1 className="font-avant-garde text-display font-bold text-[var(--color-midnight-plum)]">
            Control your
            <br />
            <span className="text-gradient-ember">spreadsheets</span>
            <br />
            with plain English
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-[18px] text-[var(--color-graphite)] leading-[1.4]">
            SheetMind connects to your Google Sheets or Excel workbooks, letting you analyze, update, and manage
            data using natural language. No formulas. No macros. Just ask.
          </p>

          <div className="mt-10 flex items-center justify-center gap-4">
            <Button size="md" onClick={() => signIn("google", { callbackUrl: "/dashboard" })}>
              <FileSpreadsheet className="mr-2 h-4 w-4" />
              Continue with Google
            </Button>
            <Button variant="ghost-cta" size="md" onClick={() => signIn("azure-ad", { callbackUrl: "/dashboard" })}>
              <LayoutPanelLeft className="mr-2 h-4 w-4" />
              Continue with Microsoft
            </Button>
          </div>

          {/* Logo Cloud Strip */}
          <div className="mt-[96px]">
            <p className="text-[12px] font-semibold uppercase tracking-[0.057em] text-[var(--color-fog)]">Trusted by top teams</p>
            <div className="mt-6 flex items-center justify-center gap-10">
              {["Acme Corp", "Beta Inc", "Gamma LLC", "Delta Co", "Epsilon Ltd"].map((name) => (
                <span key={name} className="text-[16px] font-semibold text-[var(--color-steel)] opacity-60">{name}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Product Screenshot Card */}
      <section className="mx-auto max-w-page px-4 pb-[96px]">
        <div className="rounded-[16px] bg-[var(--color-pure-white)] shadow-card">
          <div className="flex h-full min-h-[400px] items-center justify-center rounded-[16px] border border-[var(--color-iris-edge)] p-8">
            <div className="flex w-full max-w-3xl flex-col">
              <div className="flex items-center gap-2 border-b border-[var(--color-ash)] pb-3">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-[var(--color-fog)]" />
                  <div className="h-3 w-3 rounded-full bg-[var(--color-fog)]" />
                  <div className="h-3 w-3 rounded-full bg-[var(--color-fog)]" />
                </div>
                <div className="ml-4 flex flex-1 rounded-[4px] border border-[var(--color-ash)] bg-[var(--color-cream-canvas)] px-3 py-1.5 text-[12px] text-[var(--color-fog)]">
                  SheetMind &mdash; Q3 Report
                </div>
              </div>
              <div className="flex">
                <div className="w-48 border-r border-[var(--color-ash)] bg-[var(--color-cream-canvas)] p-3">
                  <div className="mb-2 flex items-center gap-2 rounded-[4px] bg-[var(--color-lavender-wash)] px-2 py-1">
                    <div className="h-2 w-2 rounded-full bg-[var(--color-aubergine-core)]" />
                    <span className="text-[11px] text-[var(--color-graphite)]"># general</span>
                  </div>
                  <div className="flex items-center gap-2 px-2 py-1">
                    <div className="h-2 w-2 rounded-full" style={{ backgroundColor: "#2bac76" }} />
                    <span className="text-[11px] text-[var(--color-steel)]"># sales</span>
                  </div>
                  <div className="flex items-center gap-2 px-2 py-1">
                    <div className="h-2 w-2 rounded-full" style={{ backgroundColor: "#1264a3" }} />
                    <span className="text-[11px] text-[var(--color-steel)]"># marketing</span>
                  </div>
                  <div className="flex items-center gap-2 px-2 py-1">
                    <div className="h-2 w-2 rounded-full" style={{ backgroundColor: "#ecb22e" }} />
                    <span className="text-[11px] text-[var(--color-steel)]"># finance</span>
                  </div>
                </div>
                <div className="flex flex-1 items-center justify-center p-8">
                  <div className="text-center">
                    <div className="text-[96px] font-avant-garde font-bold text-[var(--color-midnight-plum)]">97 min</div>
                    <div className="mt-2 text-[16px] text-[var(--color-steel)]">average time users save per week</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="mx-auto max-w-page px-4 pb-[96px]">
        <div className="grid gap-[16px] md:grid-cols-3">
          {[
            { icon: MessageSquareText, title: "Natural Language", desc: "Ask questions and give commands in plain English. No syntax to learn." },
            { icon: FileSpreadsheet, title: "Multi-Platform", desc: "Works with Google Sheets and Microsoft Excel. Seamless cross-platform sync." },
            { icon: LockKeyhole, title: "Enterprise Security", desc: "OAuth-based access with fine-grained permissions. Your data stays yours." }
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="rounded-[16px] border border-[var(--color-iris-edge)] bg-[var(--color-pure-white)] p-[32px] shadow-card">
              <div className="flex h-12 w-12 items-center justify-center rounded-[8px] bg-[var(--color-lavender-wash)] text-[var(--color-aubergine-core)]">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="mt-5 font-avant-garde text-[24px] font-bold text-[var(--color-midnight-plum)]">{title}</h3>
              <p className="mt-2 text-[16px] text-[var(--color-graphite)] leading-[1.38]">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Dark Storytelling Section */}
      <section className="bg-[var(--color-plum-deep)] px-4 py-[96px]">
        <div className="mx-auto max-w-page text-center">
          <div className="mb-6 inline-flex items-center rounded-[48px] bg-[var(--color-plum-shadow-overlay)] px-[16px] py-[6px]">
            <span className="text-[14px] font-semibold text-white/80">Enterprise</span>
          </div>
          <h2 className="font-avant-garde text-[64px] font-bold leading-[1.08] text-white">
            Built for teams
            <br />
            that need answers fast
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-[18px] leading-[1.4] text-white/80">
            From financial analysts to operations managers, SheetMind helps your team
            spend less time wrangling spreadsheets and more time making decisions.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <Button
              size="md"
              className="bg-[var(--color-pure-white)] text-[var(--color-midnight-plum)] hover:bg-white/90"
              onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            >
              Get Started Free
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
            <Button
              variant="ghost-cta"
              size="md"
              className="border-white/20 bg-transparent text-white hover:bg-white/10"
            >
              Talk to Sales
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--color-iris-edge)] bg-[var(--color-pure-white)] py-[32px]">
        <div className="mx-auto max-w-page px-4 text-center text-[14px] text-[var(--color-steel)]">
          &copy; {new Date().getFullYear()} SheetMind. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
