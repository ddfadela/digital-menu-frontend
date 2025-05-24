import NextAuth, { DefaultSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    user: {
      id?: string;
    } & DefaultSession["user"];
  }

  interface User {
    id?: string;
    accessToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    userId?: string;
  }
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_NEST_API ||
  "https://digital-menu-backend-qqek.onrender.com";

const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    CredentialsProvider({
      name: "Sign in",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "example@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          console.log("Backend URL for login:", API_BASE_URL);
          const res = await fetch(`${API_BASE_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          const user = await res.json();

          if (res.ok && user.access_token) {
            return {
              id: user.userId || user.id,
              email: credentials.email,
              name: user.name,
              accessToken: user.access_token,
            };
          }

          return null;
        } catch (error) {
          console.error("Authentication error:", error);
          return null;
        }
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },

  callbacks: {
    async jwt({ token, account, user, profile }) {
      // Handle credentials login
      if (user?.accessToken) {
        token.accessToken = user.accessToken;
        token.userId = user.id;
      }

      // Handle Google login
      if (account?.provider === "google" && profile?.email) {
        try {
          console.log("Backend URL for Google login:", API_BASE_URL);
          const res = await fetch(`${API_BASE_URL}/auth/google-login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: profile.email,
              name: profile.name,
            }),
          });

          const data = await res.json();
          if (res.ok && data.access_token) {
            token.accessToken = data.access_token;
            token.userId = data.userId;
          }
        } catch (error) {
          console.error("Google login error:", error);
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (token.accessToken) {
        session.accessToken = token.accessToken;
      }

      if (session.user && token.userId) {
        session.user.id = token.userId;
      }

      return session;
    },
  },

  debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
