import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"
import CredentialsProvider from "next-auth/providers/credentials"

export const authOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    CredentialsProvider({
      name: "GitHub Username",
      credentials: {
        username: { label: "GitHub Username", type: "text" },
      },
      async authorize(credentials) {
        if (credentials?.username) {
          return {
            id: credentials.username,
            name: credentials.username,
            login: credentials.username,
          }
        }
        return null
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET || "default_development_secret_key_123",
  callbacks: {
    async jwt({ token, user, account, profile }: { token: any; user?: any; account?: any; profile?: any }) {
      console.log("[NextAuth Callback] jwt callback triggered.");
      if (user) {
        token.login = user.login || user.name;
        console.log(`[NextAuth Callback] User logged in: ${token.login}`);
      }
      if (account) {
        token.accessToken = account.access_token;
        console.log(`[NextAuth Callback] Access token received: ${account.access_token ? "PRESENT" : "MISSING"}`);
      }
      if (profile) {
        token.login = profile.login;
        token.bio = profile.bio;
        token.id = profile.id;
        console.log(`[NextAuth Callback] GitHub profile: login=${profile.login}, id=${profile.id}`);
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      if (session.user) {
        session.user.login = token.login;
        session.user.bio = token.bio;
        session.user.id = token.id;
        session.user.accessToken = token.accessToken;
        console.log(`[NextAuth Session] Session created: login=${session.user.login}, id=${session.user.id}, token=${session.user.accessToken ? "PRESENT" : "MISSING"}`);
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth",
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
