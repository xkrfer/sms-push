import { Account, AuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
export const prisma = new PrismaClient();

export const authOptions: AuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  adapter: PrismaAdapter(prisma),
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],
  callbacks: {
    signIn: async ({ user, account }) => {
      if (!user) return false;
      if (!account) return false;
      return isInWhitelist(user, account);
    },

    session: async ({ session, token }) => {
      if (session?.user) {
        session.user.id = token.uid;
      }
      return session;
    },
    jwt: async ({ user, token }) => {
      if (user) {
        token.uid = user.id;
      }
      return token;
    },
  },
  session: {
    strategy: "jwt",
  },
};

function isInWhitelist(user: any, account: Account) {
  const email = user?.email || "";
  const emails = (process.env.WHITELIST_EMAILS || "").split(",");
  const userId = account.providerAccountId + "";
  const users = (process.env.WHITELIST_USERS || "").split(",");
  if (emails.includes(email) || users.includes(userId)) {
    return true;
  }
  return false;
}
