import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    provider?: string;
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    backendToken?: string;
    provider?: string;
    backendUser?: {
      id?: string;
      email?: string;
      name?: string;
      avatar_url?: string | null;
    };
  }
}
