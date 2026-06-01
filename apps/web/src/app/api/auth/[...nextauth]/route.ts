import NextAuth, { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";

import { prisma } from '@contentcommand/database';
import { PrismaAdapter } from "@next-auth/prisma-adapter";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID || "MOCK_GITHUB_ID",
      clientSecret: process.env.GITHUB_SECRET || "MOCK_GITHUB_SECRET",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "test@example.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) return null;

        // Lookup the actual user in the DB (for v3.2 we simulate this if DB is empty to prevent crashes during local testing without seed data)
        let user = await prisma.user.findUnique({ where: { email: credentials.email } });

        if (!user && credentials.email === "test@example.com" && credentials.password === "password") {
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

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
