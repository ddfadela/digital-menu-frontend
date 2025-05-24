import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized: ({ token }) => {
      return !!token;
    },
  },
  pages: {
    signIn: "/auth/login",
  },
});

export const config = {
  matcher: ["/admin/:path*"],
};
