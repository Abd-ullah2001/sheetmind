"use client";

export function AmbientGradient() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="bg-radial-glow absolute inset-0" />
      <div
        className="absolute bottom-0 left-1/2 h-[600px] w-[800px] -translate-x-1/2 translate-y-1/3 opacity-[0.15]"
        style={{
          background:
            "radial-gradient(ellipse at center, #EA580C 0%, transparent 70%)"
        }}
      />
      <div
        className="absolute right-0 top-0 h-[500px] w-[500px] translate-x-1/4 -translate-y-1/4 opacity-[0.08]"
        style={{
          background:
            "radial-gradient(ellipse at center, #FDBA74 0%, transparent 70%)"
        }}
      />
    </div>
  );
}
