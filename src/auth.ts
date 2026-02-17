import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/db";
import bcrypt from "bcrypt";

declare module "next-auth" {
  interface User {
    role: string;
    tenantId: string;
  }

  interface Session {
    user: {
      id: string;
      role: string;
      tenantId: string;
    };
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),

  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
        tenantSlug: {},
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password || !credentials?.tenantSlug) {
          return null;
        }
        const tenantSlug = credentials?.tenantSlug;
        if (!tenantSlug) return null;

        const tenant = await db.tenant.findUnique({
          where: { slug: tenantSlug },
        });

        if (!tenant) return null;

        const user = await db.user.findUnique({
          where: {
            email_tenantId: {
              email: credentials.email,
              tenantId: tenant.id,
            },
          },
          select: {
            id: true,
            email: true,
            password: true,
            role: true,
            tenantId: true,
          },
        });


        if (!user) return null;

        const valid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!valid) return null;

        return {
          id: user.id,
          role: user.role,
          tenantId: user.tenantId,
        };
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

      session.user = {
        ...session.user,
        id: token.id as string,
        role: token.role as string,
        tenantId: token.tenantId as string,
      };
    
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
});
