import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function ToolCallTrace({ tools }: { tools: string[] }) {
  if (!tools.length) return <span className="text-[12px] text-[var(--color-text-secondary)]">No tools recorded</span>;
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {tools.map((tool, index) => (
        <span key={`${tool}-${index}`} className="inline-flex items-center gap-1.5">
          <Badge variant="outline">{tool}</Badge>
          {index < tools.length - 1 ? <ArrowRight className="h-3 w-3 text-[var(--color-text-tertiary)]" /> : null}
        </span>
      ))}
    </div>
  );
}