import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login",
  },
});

export const config = { matcher: ["/dashboard/:path*", "/settings/:path*", "/finance/:path*", "/campaigns/:path*", "/ai-studio/:path*"] };
