"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { BarChart3, LogOut, Settings, Sparkles, Table2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const { data: session } = useSession();
  const links = [
    { href: "/dashboard", label: "Dashboard", icon: Table2 },
    { href: "/logs", label: "Logs", icon: BarChart3 },
    { href: "/settings", label: "Settings", icon: Settings }
  ];

  return (
    <header className="sticky top-0 z-30 border-b bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Sparkles className="h-4 w-4" />
          </span>
          SheetMind
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          {links.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href} className="inline-flex h-10 items-center justify-center gap-2 rounded-md px-3 text-sm font-medium transition-colors hover:bg-muted">
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-3">
          <div className="hidden text-right text-sm sm:block">
            <div className="font-medium">{session?.user?.name ?? "SheetMind User"}</div>
            <div className="text-xs text-muted-foreground">{session?.user?.email}</div>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {session?.user?.image ? <img src={session.user.image} alt="" className="h-8 w-8 rounded-full" /> : null}
          <Button variant="ghost" size="icon" title="Log out" onClick={() => signOut({ callbackUrl: "/" })}>
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
