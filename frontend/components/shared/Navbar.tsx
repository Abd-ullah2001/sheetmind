"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { BarChart3, LogOut, Settings, Table2, AudioLines } from "lucide-react";
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
    <header className="sticky top-0 z-30 h-16 border-b border-[var(--color-border)] bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-full max-w-page items-center justify-between px-4">
        <Link href="/dashboard" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-[var(--color-primary)] text-white">
            <AudioLines className="h-4 w-4" />
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-[18px] font-semibold text-[var(--color-text-primary)]">Auralis</span>
            <span className="label-mono text-[var(--color-text-tertiary)]">from Noor</span>
          </div>
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          {links.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-md px-3 text-[15px] text-[var(--color-text-primary)] transition-colors hover:bg-[var(--color-surface-soft)]"
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <div className="text-[14px] font-medium text-[var(--color-text-primary)]">{data?.user?.name ?? "Auralis User"}</div>
            <div className="text-[12px] text-[var(--color-text-secondary)]">{data?.user?.email}</div>
          </div>
          {data?.user?.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={data.user.image} alt="" className="h-8 w-8 rounded-full border border-[var(--color-border)]" />
          ) : null}
          <Button variant="ghost" size="icon" title="Log out" onClick={() => signOut({ callbackUrl: "/" })}>
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}