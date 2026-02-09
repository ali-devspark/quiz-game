import type { NextAuthConfig } from "next-auth";

export const authConfig = {
    pages: {
        signIn: "/login",
    },
    callbacks: {
        async session({ session, token }) {
            if (token.sub && session.user) {
                session.user.id = token.sub;
            }
            if (token.plan && session.user) {
                (session.user as any).plan = token.plan;
            }
            return session;
        },
        async jwt({ token, user }) {
            if (user) {
                token.plan = (user as any).plan;
            }
            return token;
        },
    },
    providers: [], // Add empty providers array, it will be populated in auth.ts
} satisfies NextAuthConfig;
