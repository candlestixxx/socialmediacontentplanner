import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

// Route files may only export HTTP handlers — the options live in @/lib/auth
// so the bundler never tries to parse them as route segment config.
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
