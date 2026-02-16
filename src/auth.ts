import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/db";
import bcrypt from "bcrypt";
import { headers } from "next/headers";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),

  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // ✅ Get tenant slug from middleware header
        const tenantSlug = "dinevora-demo"; // TEMP HARD-CODE


        // ✅ Find tenant first
        const tenant = await db.tenant.findUnique({
          where: { slug: tenantSlug },
        });

        if (!tenant) return null;

        // ✅ Now find user using COMPOSITE KEY
        const user = await db.user.findUnique({
          where: {
            email_tenantId: {
              email: credentials.email,
              tenantId: tenant.id,
            },
          },
        });


        if (!user) return null;

        const valid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!valid) return null;

        return user;
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.tenantId = user.tenantId;
      }
      return token;
    },

    async session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;
      session.user.tenantId = token.tenantId;
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
});
