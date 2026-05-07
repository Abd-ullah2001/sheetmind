"use client";

import { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { CheckCircle2, Copy, Plus, Trash2 } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import * as Tabs from "@radix-ui/react-tabs";
import { Navbar } from "@/components/shared/Navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";
import type { WebhookConfig } from "@/types";

const events = ["file_created", "sheet_edited", "formula_applied", "row_added", "export_completed"];

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const [webhooks, setWebhooks] = useState<WebhookConfig[]>([]);
  const [url, setUrl] = useState("");
  const [selectedEvents, setSelectedEvents] = useState<string[]>(["sheet_edited"]);
  const [createdSecret, setCreatedSecret] = useState<string | null>(null);
  useEffect(() => { if (session?.accessToken) api.getWebhooks(session.accessToken).then(setWebhooks).catch(() => setWebhooks([])); }, [session?.accessToken]);
  if (status === "unauthenticated") redirect("/");

  async function createWebhook() {
    if (!session?.accessToken || !url.trim()) return;
    const created = await api.createWebhook(url.trim(), selectedEvents, session.accessToken);
    setWebhooks((current) => [created, ...current]);
    setCreatedSecret(created.secret ?? null);
    setUrl("");
  }
  async function deleteWebhook(id: string) {
    if (!session?.accessToken) return;
    await api.deleteWebhook(id, session.accessToken);
    setWebhooks((current) => current.filter((item) => item.id !== id));
  }

  return (
    <div className="min-h-screen bg-background"><Navbar /><main className="mx-auto max-w-5xl px-4 py-8"><h1 className="text-2xl font-semibold">Settings</h1>
      <Tabs.Root defaultValue="account" className="mt-6"><Tabs.List className="inline-flex rounded-lg border bg-white p-1">{["account", "connections", "webhooks"].map((tab) => <Tabs.Trigger key={tab} value={tab} className="rounded-md px-4 py-2 text-sm font-medium capitalize data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">{tab === "connections" ? "Connected Accounts" : tab}</Tabs.Trigger>)}</Tabs.List>
        <Tabs.Content value="account" className="mt-5"><Card><CardHeader><CardTitle>Account</CardTitle></CardHeader><CardContent className="space-y-4"><div><div className="text-sm font-medium">{session?.user?.name}</div><div className="text-sm text-muted-foreground">{session?.user?.email}</div><div className="mt-2"><Badge variant="outline">{session?.provider ?? "oauth"}</Badge></div></div><Button variant="outline" onClick={() => signOut({ callbackUrl: "/" })}>Logout</Button></CardContent></Card></Tabs.Content>
        <Tabs.Content value="connections" className="mt-5"><Card><CardHeader><CardTitle>Connected Accounts</CardTitle></CardHeader><CardContent className="space-y-3">{["Google", "Microsoft"].map((provider) => <div key={provider} className="flex items-center justify-between rounded-lg border p-4"><div className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 text-emerald-600" /><div><div className="font-medium">{provider}</div><div className="text-sm text-muted-foreground">OAuth connection ready</div></div></div><Button variant="outline">Disconnect</Button></div>)}</CardContent></Card></Tabs.Content>
        <Tabs.Content value="webhooks" className="mt-5"><Card><CardHeader className="flex flex-row items-center justify-between"><CardTitle>Zapier Webhooks</CardTitle><Dialog.Root><Dialog.Trigger asChild><Button><Plus className="h-4 w-4" />Add Webhook</Button></Dialog.Trigger><Dialog.Portal><Dialog.Overlay className="fixed inset-0 z-40 bg-black/30" /><Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[min(92vw,520px)] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-5 shadow-xl"><Dialog.Title className="text-lg font-semibold">Add Webhook</Dialog.Title><div className="mt-4 space-y-4"><Input value={url} onChange={(event) => setUrl(event.target.value)} placeholder="https://hooks.zapier.com/..." /><div className="grid gap-2">{events.map((eventName) => <label key={eventName} className="flex items-center gap-2 text-sm"><input type="checkbox" checked={selectedEvents.includes(eventName)} onChange={(event) => setSelectedEvents((current) => event.target.checked ? [...current, eventName] : current.filter((item) => item !== eventName))} />{eventName}</label>)}</div><Button onClick={() => void createWebhook()}>Submit</Button>{createdSecret ? <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm"><div className="font-medium">Webhook secret shown once</div><div className="mt-2 flex items-center gap-2"><code className="min-w-0 flex-1 truncate rounded bg-white px-2 py-1">{createdSecret}</code><Button size="icon" variant="outline" onClick={() => navigator.clipboard.writeText(createdSecret)}><Copy className="h-4 w-4" /></Button></div></div> : null}</div></Dialog.Content></Dialog.Portal></Dialog.Root></CardHeader><CardContent className="space-y-3">{webhooks.map((webhook) => <div key={webhook.id} className="flex items-center justify-between gap-4 rounded-lg border p-4"><div className="min-w-0"><div className="truncate font-medium">{webhook.zapier_url}</div><div className="mt-2 flex flex-wrap gap-1">{webhook.events.map((eventName) => <Badge key={eventName} variant="outline">{eventName}</Badge>)}</div></div><div className="flex items-center gap-2"><Badge variant={webhook.active ? "success" : "outline"}>{webhook.active ? "active" : "paused"}</Badge><Button size="icon" variant="ghost" onClick={() => void deleteWebhook(webhook.id)}><Trash2 className="h-4 w-4" /></Button></div></div>)}{webhooks.length === 0 ? <div className="rounded-lg border p-6 text-center text-sm text-muted-foreground">No webhooks configured.</div> : null}</CardContent></Card></Tabs.Content>
      </Tabs.Root></main></div>
  );
}
