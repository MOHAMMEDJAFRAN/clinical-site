import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google"
import FacebookProvider from "next-auth/providers/facebook";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET, // Important!
  pages: {
    signIn: "/login", // Redirect to login page
  },
  callbacks: {
    async signIn({ account, profile }) {
      return true; // Allow login
    },
    async redirect({ url, baseUrl }) {
      return baseUrl; // Redirect after login
    },
    async session({ session, token }) {
      session.user.id = token.sub;
      return session;
    },
    async jwt({ token, user }) {
      if (user) token.sub = user.id;
      return token;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
