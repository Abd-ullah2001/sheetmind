"use client";

import { useState, useEffect, useRef } from "react";
import { Send, Bot, User, Loader2, Sparkles, X, Minimize2, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
      // Create a unique session ID for this chat
      const sessionId = `session_${fileId}`;
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"}/api/v1/agent/query`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          file_id: fileId,
          query: input,
          session_id: sessionId
        })
      });

      if (!response.ok) throw new Error("Agent failed to respond");
      
      const data = await response.json();
      
      const assistantMessage: Message = {
        role: "assistant",
        content: data.response || data.message || "I've processed your request.",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        role: "assistant",
        content: "Sorry, I encountered an error while processing your request. Please make sure the backend is running.",
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
        "fixed bottom-6 right-6 z-50 flex flex-col transition-all duration-300 ease-in-out shadow-2xl rounded-2xl border bg-white overflow-hidden",
        isMinimized ? "h-14 w-64" : "h-[600px] w-[400px] max-w-[calc(100vw-48px)]"
      )}
    >
      <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white cursor-pointer" onClick={() => isMinimized && setIsMinimized(false)}>
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5" />
          <span className="font-semibold truncate max-w-[150px]">
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
            className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50"
          >
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center p-6 opacity-60">
                <div className="bg-blue-100 p-3 rounded-full mb-3 text-blue-600">
                  <Bot className="h-8 w-8" />
                </div>
                <p className="text-sm font-medium text-slate-600">
                  Hi! I&apos;m your SheetMind agent. <br />
                  How can I help you with <b>{fileName}</b>?
                </p>
                <div className="mt-4 grid gap-2 w-full">
                  <button 
                    onClick={() => setInput("Summarize this spreadsheet")}
                    className="text-xs bg-white border rounded-lg py-2 px-3 hover:bg-blue-50 hover:border-blue-200 transition-colors text-left"
                  >
                    &quot;Summarize this spreadsheet&quot;
                  </button>
                  <button 
                    onClick={() => setInput("Add a new column for totals")}
                    className="text-xs bg-white border rounded-lg py-2 px-3 hover:bg-blue-50 hover:border-blue-200 transition-colors text-left"
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
                  "flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-lg border shadow-sm",
                  m.role === "user" ? "bg-white text-slate-700" : "bg-blue-600 text-white"
                )}>
                  {m.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                </div>
                <div className={cn(
                  "flex flex-col gap-1 max-w-[80%]",
                  m.role === "user" ? "items-end" : "items-start"
                )}>
                  <div className={cn(
                    "rounded-2xl px-4 py-2 text-sm shadow-sm",
                    m.role === "user" ? "bg-white border rounded-tr-none text-slate-700" : "bg-blue-50 border-blue-100 border rounded-tl-none text-slate-800"
                  )}>
                    {m.content}
                  </div>
                  <span className="text-[10px] text-slate-400">
                    {m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-lg border bg-blue-600 text-white shadow-sm">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="bg-blue-50 border border-blue-100 rounded-2xl rounded-tl-none px-4 py-3 shadow-sm">
                  <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border-t bg-white">
            <div className="flex gap-2">
              <Input 
                placeholder="Ask your agent..." 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                className="flex-1 rounded-xl border-slate-200 focus-visible:ring-blue-600"
              />
              <Button 
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="rounded-xl px-3 bg-blue-600 hover:bg-blue-700 shadow-md"
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
