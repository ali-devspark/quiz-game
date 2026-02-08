import type { NextAuthConfig } from "next-auth";

export const authConfig = {
    pages: {
        signIn: "/login",
    },
    callbacks: {
        async session({ session, token }: any) {
            if (token.sub && session.user) {
                session.user.id = token.sub;
            }
            if (token.plan && session.user) {
                session.user.plan = token.plan;
            }
            return session;
        },
        async jwt({ token, user }: any) {
            if (user) {
                token.plan = (user as any).plan;
            }
            return token;
        },
    },
    providers: [], // Add empty providers array, it will be populated in auth.ts
} satisfies NextAuthConfig;
