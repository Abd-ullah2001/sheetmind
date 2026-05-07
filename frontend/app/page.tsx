"use client";

import { signIn, useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { FileSpreadsheet, LockKeyhole, MessageSquareText, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const { status } = useSession();
  if (status === "authenticated") redirect("/dashboard");
  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <section className="w-full max-w-md text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-lg bg-primary text-primary-foreground"><Sparkles className="h-7 w-7" /></div>
        <h1 className="mt-5 text-3xl font-semibold tracking-normal">SheetMind</h1>
        <p className="mt-2 text-muted-foreground">Control your spreadsheets with plain English</p>
        <div className="mt-8 space-y-3">
          <Button className="w-full" onClick={() => signIn("google", { callbackUrl: "/dashboard" })}><FileSpreadsheet className="h-4 w-4" />Continue with Google</Button>
          <Button className="w-full" variant="outline" onClick={() => signIn("azure-ad", { callbackUrl: "/dashboard" })}><FileSpreadsheet className="h-4 w-4" />Continue with Microsoft</Button>
        </div>
        <div className="mt-8 grid gap-3 text-left">
          {[
            { icon: FileSpreadsheet, text: "Works with Excel & Google Sheets" },
            { icon: MessageSquareText, text: "Natural language queries" },
            { icon: LockKeyhole, text: "Secure OAuth login" }
          ].map((item) => {
            const Icon = item.icon;
            return <div key={item.text} className="flex items-center gap-3 rounded-lg border bg-white p-3 text-sm"><Icon className="h-4 w-4 text-primary" />{item.text}</div>;
          })}
        </div>
      </section>
    </main>
  );
}
