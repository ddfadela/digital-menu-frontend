import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        const res = await fetch(`${process.env.NEST_API}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(credentials),
        });

        const user = await res.json();

        if (res.ok && user.access_token) {
          return {
            id: user.userId,
            email: credentials?.email,
            accessToken: user.access_token,
          };
        }
        return null;
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },

  callbacks: {
    async jwt({ token, account, user, profile }) {
      // From Google login
      if (account?.provider === "google") {
        try {
          const res = await fetch(`${process.env.NEST_API}/auth/google-login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: profile?.email,
              name: profile?.name,
            }),
          });

          const data = await res.json();
          if (res.ok && data.access_token) {
            token.accessToken = data.access_token;
            token.userId = data.userId;
          } else {
          }
        } catch (error) {}
      }

      return token;
    },
  },
});

export { handler as GET, handler as POST };
