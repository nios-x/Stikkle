import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"

export const authOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
      authorization: {
        params: {
          scope: "read:user user:email repo",
        },
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, account, profile }: { token: any; account?: any; profile?: any }) {
      // Store the GitHub login (username) in the JWT token
      if (account) {
        token.accessToken = account.access_token
      }
      if (profile) {
        token.login = profile.login
        token.bio = profile.bio
      }
      return token
    },
    async session({ session, token }: { session: any; token: any }) {
      // Expose login and accessToken to the client-side session
      if (session.user) {
        session.user.login = token.login
        session.user.bio = token.bio
        session.user.accessToken = token.accessToken
      }
      return session
    },
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
