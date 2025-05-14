import NextAuth, { DefaultSession, Session } from "next-auth"
import { JWT } from "next-auth/jwt"
import GoogleProvider from "next-auth/providers/google"
import { supabase } from '@/utils/supabase'

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
    async jwt({ token, trigger, session, user }) {
      // If updating the session with a new type (after role select)
      if (trigger === "update" && session?.user?.type) {
        token.type = session.user.type
      }
      // If logging in, fetch the user's type from Supabase if not already present
      if (!token.type && token.email) {
        const { data, error } = await supabase
          .from('users')
          .select('type')
          .eq('email', token.email)
          .single();
        if (data?.type) {
          token.type = data.type;
        }
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
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        // Check if user exists
        const { data, error } = await supabase
          .from('users')
          .select('id')
          .eq('email', user.email)
          .single();
        if (!data) {
          const { error: insertError } = await supabase
            .from('users')
            .insert([
              {
                name: user.name,
                email: user.email,
                location: null,
                type: null,
                created_at: new Date().toISOString(),
              },
            ]);
          if (insertError) {
            // Optionally log or handle error
            return false;
          }
        }
      }
      return true;
    },
  },
})

export { handler as GET, handler as POST } 