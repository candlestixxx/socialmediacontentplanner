import { type NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";

import { prisma } from '@contentcommand/database';
import { PrismaAdapter } from "@next-auth/prisma-adapter";

/**
 * NextAuth options for contentcommand.
 *
 * Why this lives here and not in the route file: Next.js 16 route handlers may
 * only export HTTP methods (GET/POST/...) and route segment config. Exporting
 * `authOptions` from `app/api/auth/[...nextauth]/route.ts` makes the bundler
 * try to parse it as route config and fails the whole build with
 * "data did not match any variant of untagged enum Config".
 *
 * Side effect: anything that needs the auth config (session helpers, tests,
 * other routes) imports from here instead of reaching into the route file.
 */
export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    // Register GitHub OAuth only when real credentials are configured. No mock
    // client id/secret fallback — a placeholder provider would silently fail
    // against the real GitHub OAuth endpoint.
    ...(process.env['GITHUB_ID'] && process.env['GITHUB_SECRET']
      ? [
          GithubProvider({
            clientId: process.env['GITHUB_ID'],
            clientSecret: process.env['GITHUB_SECRET'],
          }),
        ]
      : []),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "test@example.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, _req) {
        if (!credentials?.email || !credentials?.password) return null;

        // Lookup the actual user in the DB (for v3.2 we simulate this if DB is empty to prevent crashes during local testing without seed data)
        let user = await prisma.user.findUnique({ where: { email: credentials.email } });

        // Demo login is a LOCAL-ONLY convenience so the app can boot without seed
        // data. It is hard-disabled in production and requires an explicit opt-in
        // via ALLOW_DEMO_LOGIN=true. Never leave a fixed credential live in prod.
        const demoLoginEnabled =
          process.env['NODE_ENV'] !== 'production' &&
          process.env['ALLOW_DEMO_LOGIN'] === 'true';

        if (!user && demoLoginEnabled && credentials.email === "test@example.com" && credentials.password === "password") {
          // If the demo user doesn't exist in the DB, create it to ensure JWT payload resolves correctly
          user = await prisma.user.create({
            data: {
              email: "test@example.com",
              name: "Demo User",
            }
          });
        }

        if (user) {
          return { id: user.id, name: user.name, email: user.email };
        }

        return null;
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  callbacks: {
    async session({ session, token }) {
      if (session?.user) {
        (session.user as any).id = token.sub;
      }
      return session;
    }
  },
  pages: {
    signIn: '/login'
  }
};
