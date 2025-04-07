import GoogleProvider from "next-auth/providers/google";
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
    async redirect({ baseUrl }) {
      return baseUrl; // Redirect after login
    },
    async jwt({ token, user }) {
      if (user) {

        token.sub = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.sub;
      console.log(session,token);
      
      return session;
    },
    
  },
};