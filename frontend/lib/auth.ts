import type { NextAuthOptions } from "next-auth";
import AzureADProvider from "next-auth/providers/azure-ad";
import GoogleProvider from "next-auth/providers/google";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

async function exchangeOAuthTokens(provider: string, account: { access_token?: string; refresh_token?: string; expires_at?: number; scope?: string }) {
  const endpoint = provider === "azure-ad" ? "microsoft" : "google";
  const response = await fetch(`${API_BASE}/api/v1/auth/${endpoint}/callback`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      access_token: account.access_token,
      refresh_token: account.refresh_token,
      expires_at: account.expires_at,
      scope: account.scope
    })
  });

  if (!response.ok) {
    throw new Error(`Backend OAuth callback failed: ${await response.text()}`);
  }
  return response.json() as Promise<{
    access_token: string;
    user: { id: string; email: string; name?: string; avatar_url?: string | null };
  }>;
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      authorization: {
        params: {
          scope: "openid email profile https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive.readonly",
          access_type: "offline",
          prompt: "consent"
        }
      }
    }),
    AzureADProvider({
      clientId: process.env.AZURE_AD_CLIENT_ID ?? "",
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET ?? "",
      tenantId: process.env.AZURE_AD_TENANT_ID ?? "common",
      authorization: { params: { scope: "openid profile email offline_access Files.ReadWrite.All Sites.ReadWrite.All" } }
    })
  ],
  callbacks: {
    async jwt({ token, account, trigger }) {
      // Only exchange tokens on the initial sign-in.
      if (trigger === "signIn" && account?.provider && account.access_token) {
        const backend = await exchangeOAuthTokens(account.provider, account);
        token.backendToken = backend.access_token;
        token.provider = account.provider;
        token.backendUser = backend.user;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.backendToken;
      session.provider = token.provider;
      if (token.backendUser) {
        session.user.id = token.backendUser.id;
        session.user.email = token.backendUser.email;
        session.user.name = token.backendUser.name ?? session.user.name;
        session.user.image = token.backendUser.avatar_url ?? session.user.image;
      }
      return session;
    }
  },
  pages: {
    signIn: "/",
    error: "/?error=Callback"
  },
  session: { strategy: "jwt" }
};
