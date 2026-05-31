import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"

export const authOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, profile }: { token: any; profile?: any }) {
      // Store the GitHub login (username) in the JWT token
      if (profile) {
        token.login = profile.login
        token.bio = profile.bio
      }
      return token
    },
    async session({ session, token }: { session: any; token: any }) {
      // Expose login to the client-side session
      if (session.user) {
        session.user.login = token.login
        session.user.bio = token.bio
      }
      return session
    },
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
