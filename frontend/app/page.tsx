"use client";

import { signIn, useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { FileSpreadsheet, LockKeyhole, MessageSquareText, Sparkles, LayoutPanelLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const { status } = useSession();
  
  if (status === "authenticated") redirect("/dashboard");

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 px-4">
      {/* Animated Background Blobs */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-teal-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      
      {/* Grid Overlay */}
      <div className="absolute inset-0 bg-grid opacity-[0.03]"></div>

      <section className="relative w-full max-w-md">
        <div className="glass rounded-3xl p-8 shadow-2xl shadow-blue-500/10">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-200 ring-4 ring-white">
              <Sparkles className="h-8 w-8" />
            </div>
            
            <h1 className="mt-6 text-4xl font-bold tracking-tight text-slate-900">
              SheetMind
            </h1>
            <p className="mt-2 text-balance text-slate-500 font-medium">
              Your spreadsheets, powered by AI. <br />
              Analyze data using natural language.
            </p>
          </div>

          <div className="mt-10 space-y-4">
            <Button 
              className="w-full h-12 text-base font-semibold shadow-md bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95" 
              onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            >
              <FileSpreadsheet className="mr-2 h-5 w-5 opacity-90" />
              Continue with Google
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full h-12 text-base font-semibold border-slate-200 hover:bg-slate-50 transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95" 
              onClick={() => signIn("azure-ad", { callbackUrl: "/dashboard" })}
            >
              <LayoutPanelLeft className="mr-2 h-5 w-5 text-blue-600 opacity-90" />
              Continue with Microsoft
            </Button>
          </div>

          <div className="mt-10 grid gap-4">
            {[
              { icon: MessageSquareText, text: "Natural language analysis", color: "text-blue-500" },
              { icon: FileSpreadsheet, text: "Excel & Google Sheets support", color: "text-indigo-500" },
              { icon: LockKeyhole, text: "Enterprise-grade security", color: "text-teal-500" }
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.text} className="flex items-center gap-4 px-1 group">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`h-4 w-4 ${item.color}`} />
                  </div>
                  <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900 transition-colors">
                    {item.text}
                  </span>
                </div>
              );
            })}
          </div>

          <p className="mt-8 text-center text-xs text-slate-400">
            By continuing, you agree to our Terms and Privacy Policy.
          </p>
        </div>
      </section>
    </main>
  );
}
