"use client";

export const dynamic = "force-dynamic";

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
  const sessionRes = useSession();
  const data = sessionRes?.data;
  const status = sessionRes?.status;
  const accessToken = data?.accessToken;
  const [webhooks, setWebhooks] = useState<WebhookConfig[]>([]);
  const [url, setUrl] = useState("");
  const [selectedEvents, setSelectedEvents] = useState<string[]>(["sheet_edited"]);
  const [createdSecret, setCreatedSecret] = useState<string | null>(null);
  useEffect(() => { if (accessToken) api.getWebhooks(accessToken).then(setWebhooks).catch(() => setWebhooks([])); }, [accessToken]);
  if (status === "unauthenticated") redirect("/");

  async function createWebhook() {
    if (!accessToken || !url.trim()) return;
    const created = await api.createWebhook(url.trim(), selectedEvents, accessToken);
    setWebhooks((current) => [created, ...current]);
    setCreatedSecret(created.secret ?? null);
    setUrl("");
  }
  async function deleteWebhook(id: string) {
    if (!accessToken) return;
    await api.deleteWebhook(id, accessToken);
    setWebhooks((current) => current.filter((item) => item.id !== id));
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="mx-auto max-w-page px-4 py-8">
        <h1 className="text-[32px] font-semibold text-[var(--color-text-primary)]">Settings</h1>
        <Tabs.Root defaultValue="account" className="mt-6">
          <Tabs.List className="inline-flex rounded-[var(--radius-control)] border border-[var(--color-border)] bg-white p-1">
            {["account", "connections", "webhooks"].map((tab) => (
              <Tabs.Trigger
                key={tab}
                value={tab}
                className="rounded-md px-4 py-2 text-[14px] font-semibold capitalize text-[var(--color-text-secondary)] data-[state=active]:bg-[var(--color-primary)] data-[state=active]:text-white"
              >
                {tab === "connections" ? "Connected Accounts" : tab}
              </Tabs.Trigger>
            ))}
          </Tabs.List>

          <Tabs.Content value="account" className="mt-5">
            <Card>
              <CardHeader>
                <CardTitle>Account</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-[14px] font-medium text-[var(--color-text-primary)]">{data?.user?.name}</div>
                  <div className="text-[14px] text-[var(--color-text-secondary)]">{data?.user?.email}</div>
                  <div className="mt-2">
                    <Badge variant="outline">{data?.provider ?? "oauth"}</Badge>
                  </div>
                </div>
                <Button variant="outline" onClick={() => signOut({ callbackUrl: "/" })}>Logout</Button>
              </CardContent>
            </Card>
          </Tabs.Content>

          <Tabs.Content value="connections" className="mt-5">
            <Card>
              <CardHeader>
                <CardTitle>Connected Accounts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {["Google", "Microsoft"].map((provider) => (
                  <div key={provider} className="flex items-center justify-between rounded-[var(--radius-control)] border border-[var(--color-border)] p-4">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                      <div>
                        <div className="text-[14px] font-medium text-[var(--color-text-primary)]">{provider}</div>
                        <div className="text-[14px] text-[var(--color-text-secondary)]">OAuth connection ready</div>
                      </div>
                    </div>
                    <Button variant="outline">Disconnect</Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </Tabs.Content>

          <Tabs.Content value="webhooks" className="mt-5">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Zapier Webhooks</CardTitle>
                <Dialog.Root>
                  <Dialog.Trigger asChild>
                    <Button>
                      <Plus className="h-4 w-4" />
                      Add Webhook
                    </Button>
                  </Dialog.Trigger>
                  <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 z-40 bg-black/30" />
                    <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[min(92vw,520px)] -translate-x-1/2 -translate-y-1/2 rounded-[var(--radius-card)] bg-white p-5 shadow-xl">
                      <Dialog.Title className="text-[24px] font-semibold text-[var(--color-text-primary)]">Add Webhook</Dialog.Title>
                      <div className="mt-4 space-y-4">
                        <Input
                          value={url}
                          onChange={(event) => setUrl(event.target.value)}
                          placeholder="https://hooks.zapier.com/..."
                        />
                        <div className="grid gap-2">
                          {events.map((eventName) => (
                            <label key={eventName} className="flex items-center gap-2 text-[14px] text-[var(--color-text-primary)]">
                              <input
                                type="checkbox"
                                checked={selectedEvents.includes(eventName)}
                                onChange={(event) =>
                                  setSelectedEvents((current) =>
                                    event.target.checked ? [...current, eventName] : current.filter((item) => item !== eventName)
                                  )
                                }
                                className="accent-[var(--color-primary)]"
                              />
                              {eventName}
                            </label>
                          ))}
                        </div>
                        <Button onClick={() => void createWebhook()}>Submit</Button>
                        {createdSecret ? (
                          <div className="rounded-[var(--radius-control)] border border-amber-200 bg-amber-50 p-3 text-[14px]">
                            <div className="font-medium text-amber-800">Webhook secret shown once</div>
                            <div className="mt-2 flex items-center gap-2">
                              <code className="min-w-0 flex-1 truncate rounded bg-white px-2 py-1 text-[var(--color-text-primary)]">
                                {createdSecret}
                              </code>
                              <Button size="icon" variant="outline" onClick={() => navigator.clipboard.writeText(createdSecret)}>
                                <Copy className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ) : null}
                      </div>
                    </Dialog.Content>
                  </Dialog.Portal>
                </Dialog.Root>
              </CardHeader>
              <CardContent className="space-y-3">
                {webhooks.map((webhook) => (
                  <div key={webhook.id} className="flex items-center justify-between gap-4 rounded-[var(--radius-control)] border border-[var(--color-border)] p-4">
                    <div className="min-w-0">
                      <div className="truncate text-[14px] font-medium text-[var(--color-text-primary)]">{webhook.zapier_url}</div>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {webhook.events.map((eventName) => (
                          <Badge key={eventName} variant="outline">{eventName}</Badge>
                        ))}
                      </div>
                    </div>
                    <Button variant="outline" size="icon" onClick={() => void deleteWebhook(webhook.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </Tabs.Content>
        </Tabs.Root>
      </main>
    </div>
  );
}