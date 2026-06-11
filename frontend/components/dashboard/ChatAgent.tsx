"use client";

import { useState, useEffect, useRef } from "react";
import { Send, Bot, User, Loader2, Sparkles, X, Minimize2, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface ChatAgentProps {
  fileId: string | null;
  fileName: string | null;
  token: string | undefined;
  onClose: () => void;
}

export function ChatAgent({ fileId, fileName, token, onClose }: ChatAgentProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const sessionIdRef = useRef<string>(typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : "");

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !fileId || !token || isLoading) return;

    const userMessage: Message = {
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const data = await api.runAgentQuery(fileId, input, sessionIdRef.current || undefined, token);

      const assistantMessage: Message = {
        role: "assistant",
        content: data.response || "I've processed your request.",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        role: "assistant",
        content: error instanceof Error ? error.message : "Sorry, I encountered an error while processing your request.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!fileId || !token) return null;

  return (
    <div
      className={cn(
        "fixed bottom-6 right-6 z-50 flex flex-col overflow-hidden rounded-[16px] border border-[var(--color-iris-edge)] bg-[var(--color-pure-white)] shadow-xl transition-all duration-300 ease-in-out",
        isMinimized ? "h-14 w-64" : "h-[600px] w-[400px] max-w-[calc(100vw-48px)]"
      )}
    >
      <div
        className="flex cursor-pointer items-center justify-between bg-[var(--color-aubergine-core)] px-4 py-3 text-[var(--color-pure-white)]"
        onClick={() => isMinimized && setIsMinimized(false)}
      >
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5" />
          <span className="max-w-[150px] truncate font-semibold">
            {isMinimized ? "SheetMind Agent" : `Chat: ${fileName}`}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-white hover:bg-white/20"
            onClick={(e) => {
              e.stopPropagation();
              setIsMinimized(!isMinimized);
            }}
          >
            {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-white hover:bg-white/20"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {!isMinimized && (
        <>
          <div
            ref={scrollRef}
            className="flex-1 space-y-4 overflow-y-auto bg-[var(--color-cream-canvas)] p-4"
          >
            {messages.length === 0 && (
              <div className="flex h-full flex-col items-center justify-center p-6 text-center opacity-60">
                <div className="mb-3 rounded-full bg-[var(--color-lavender-wash)] p-3 text-[var(--color-aubergine-core)]">
                  <Bot className="h-8 w-8" />
                </div>
                <p className="text-[14px] font-medium text-[var(--color-graphite)]">
                  Hi! I&apos;m your SheetMind agent. <br />
                  How can I help you with <b>{fileName}</b>?
                </p>
                <div className="mt-4 grid w-full gap-2">
                  <button
                    onClick={() => setInput("Summarize this spreadsheet")}
                    className="rounded-[8px] border border-[var(--color-iris-edge)] bg-[var(--color-pure-white)] px-3 py-2 text-left text-[12px] transition-colors hover:bg-[var(--color-lavender-wash)] hover:border-[var(--color-violet-glow)]"
                  >
                    &quot;Summarize this spreadsheet&quot;
                  </button>
                  <button
                    onClick={() => setInput("Add a new column for totals")}
                    className="rounded-[8px] border border-[var(--color-iris-edge)] bg-[var(--color-pure-white)] px-3 py-2 text-left text-[12px] transition-colors hover:bg-[var(--color-lavender-wash)] hover:border-[var(--color-violet-glow)]"
                  >
                    &quot;Add a new column for totals&quot;
                  </button>
                </div>
              </div>
            )}

            {messages.map((m, i) => (
              <div
                key={i}
                className={cn(
                  "flex items-start gap-3",
                  m.role === "user" ? "flex-row-reverse" : "flex-row"
                )}
              >
                <div className={cn(
                  "flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-[8px] border shadow-sm",
                  m.role === "user" ? "bg-[var(--color-pure-white)] text-[var(--color-graphite)] border-[var(--color-iris-edge)]" : "bg-[var(--color-aubergine-core)] text-[var(--color-pure-white)] border-[var(--color-aubergine-core)]"
                )}>
                  {m.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                </div>
                <div className={cn(
                  "flex flex-col gap-1 max-w-[80%]",
                  m.role === "user" ? "items-end" : "items-start"
                )}>
                  <div className={cn(
                    "rounded-[16px] px-4 py-2 text-[14px]",
                    m.role === "user" ? "bg-[var(--color-aubergine-core)] text-[var(--color-pure-white)]" : "bg-[var(--color-pure-white)] border border-[var(--color-iris-edge)] text-[var(--color-midnight-plum)]"
                  )}>
                    {m.content}
                  </div>
                  <span className="text-[10px] text-[var(--color-fog)]">
                    {m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-[8px] border border-[var(--color-aubergine-core)] bg-[var(--color-aubergine-core)] text-[var(--color-pure-white)] shadow-sm">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="rounded-[16px] border border-[var(--color-iris-edge)] bg-[var(--color-pure-white)] px-4 py-3">
                  <Loader2 className="h-4 w-4 animate-spin text-[var(--color-aubergine-core)]" />
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-[var(--color-iris-edge)] bg-[var(--color-pure-white)] p-4">
            <div className="flex gap-2">
              <Input
                placeholder="Ask your agent..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                className="flex-1"
              />
              <Button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="px-3"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
