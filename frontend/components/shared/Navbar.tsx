"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { BarChart3, LogOut, Settings, Table2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const sessionRes = useSession();
  const data = sessionRes?.data;
  const links = [
    { href: "/dashboard", label: "Dashboard", icon: Table2 },
    { href: "/logs", label: "Logs", icon: BarChart3 },
    { href: "/settings", label: "Settings", icon: Settings }
  ];

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-[var(--color-iris-edge)] bg-[var(--color-pure-white)]/95 backdrop-blur">
      <div className="mx-auto flex h-full max-w-page items-center justify-between px-4">
        <Link href="/dashboard" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-[4px] bg-[var(--color-aubergine-core)] text-[var(--color-pure-white)]">
            <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4">
              <rect x="2" y="2" width="7" height="7" rx="1" fill="currentColor" opacity="0.7" />
              <rect x="11" y="2" width="7" height="7" rx="1" fill="currentColor" />
              <rect x="2" y="11" width="7" height="7" rx="1" fill="currentColor" opacity="0.85" />
              <rect x="11" y="11" width="7" height="7" rx="1" fill="currentColor" opacity="0.55" />
            </svg>
          </span>
          <div className="flex items-baseline gap-1">
            <span className="font-avant-garde text-[18px] font-bold text-[var(--color-midnight-plum)]">SheetMind</span>
            <span className="text-[11px] font-semibold uppercase tracking-[0.057em] text-[var(--color-steel)]">from Noor</span>
          </div>
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          {links.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-[4px] px-3 text-[15px] font-regular text-[var(--color-midnight-plum)] transition-colors hover:bg-[var(--color-lavender-wash)]"
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <div className="text-[14px] font-medium text-[var(--color-midnight-plum)]">{data?.user?.name ?? "SheetMind User"}</div>
            <div className="text-[12px] text-[var(--color-steel)]">{data?.user?.email}</div>
          </div>
          {data?.user?.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={data.user.image} alt="" className="h-8 w-8 rounded-full border border-[var(--color-iris-edge)]" />
          ) : null}
          <Button variant="ghost" size="icon" title="Log out" onClick={() => signOut({ callbackUrl: "/" })}>
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
