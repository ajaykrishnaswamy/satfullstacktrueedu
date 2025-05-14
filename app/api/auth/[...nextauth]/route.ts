import NextAuth, { DefaultSession, Session } from "next-auth"
import { JWT } from "next-auth/jwt"
import GoogleProvider from "next-auth/providers/google"
import { supabase } from "@/utils/supabase"

// Extend the built-in session type
declare module "next-auth" {
  interface Session {
    user: {
      type?: string
    } & DefaultSession["user"]
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    type?: string
  }
}

interface ExtendedSession extends Session {
  userType?: string
}

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  callbacks: {
    async signIn({ user }) {
      if (user?.email) {
        await supabase
          .from('users')
          .upsert({
            email: user.email,
            name: user.name || null,
          }, { onConflict: 'email' });
      }
      return true;
    },
    async jwt({ token, trigger, session }) {
      if (trigger === "update" && session?.user?.type) {
        token.type = session.user.type
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.type = token.type
      }
      return session
    },
    async redirect({ url, baseUrl }) {
      // Allow relative callback URLs
      if (url.startsWith("/")) {
        return `${baseUrl}${url}`
      }
      // Allow callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) {
        return url
      }
      return baseUrl
    },
  },
})

export { handler as GET, handler as POST } 