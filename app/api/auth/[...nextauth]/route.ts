import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
// types/next-auth.d.ts
import { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session extends DefaultSession {
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
const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const res = await fetch(`${process.env.NEST_API}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(credentials),
          });

          const user = await res.json();

          if (res.ok && user.access_token) {
            return {
              id: user.userId,
              email: credentials.email,
              accessToken: user.access_token,
            };
          }
        } catch (error) {
          console.error("Authentication error:", error);
        }

        return null;
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/auth/login",
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
          const res = await fetch(`${process.env.NEST_API}/auth/google-login`, {
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
      // Type assertion to work around TypeScript issues
      const extendedSession = session as typeof session & {
        accessToken?: string;
      };

      if (token.accessToken) {
        extendedSession.accessToken = token.accessToken;
      }

      if (session.user && token.userId) {
        session.user.id = token.userId;
      }

      return extendedSession;
    },
  },
});

export { handler as GET, handler as POST };
