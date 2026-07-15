"use client";

export const dynamic = "force-dynamic";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { TrustBar } from "@/components/landing/TrustBar";
import { DemoShowcase } from "@/components/landing/mockups/DemoShowcase";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { GetStartedSection } from "@/components/landing/GetStartedSection";
import { PlatformSection } from "@/components/landing/PlatformSection";
import { TestimonialFAQSection } from "@/components/landing/TestimonialFAQSection";
import { FinalCTA, LandingFooter } from "@/components/landing/FinalCTA";

export default function LandingPage() {
  const session = useSession();
  const status = session?.status;

  if (status === "authenticated") redirect("/dashboard");

  return (
    <div className="min-h-screen bg-white antialiased">
      <LandingNavbar />
      <main>
        <HeroSection />
        <TrustBar />
        <DemoShowcase />
        <FeaturesSection />
        <GetStartedSection />
        <PlatformSection />
        <TestimonialFAQSection />
        <FinalCTA />
      </main>
      <LandingFooter />
    </div>
  );
}
