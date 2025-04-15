import CredentialsProvider from "next-auth/providers/credentials";
import connectDB from "@/backend/lib/mongodb";
import UserDetails from "@/backend/models/User";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import bcrypt from "bcryptjs";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        usernameOrEmail: { label: "usernameOrEmail", type: "text" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials) {
        await connectDB();

        const { usernameOrEmail, password } = credentials;

        // Normalize input
        const identifier = usernameOrEmail.toLowerCase();

        // Lookup by username or email
        const user = await UserDetails.findOne({
          $or: [
            { username: identifier },
            { email: identifier }
          ]
        });

        // Validation checks
        if (!user) return null; // User not found
        if (!user.is_active) return null; // Account disabled
        if (!user.is_verified) return null; // Account not verified

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return null; // Password mismatch

        // Successful login: return user data for session/JWT
        return {
          id: user._id.toString(),
          name: user.full_name,
          email: user.email || "",
          role: user.role,
        };
      },
    }),
  ],

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
    // Store user info in the JWT
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },

    // Expose JWT info to the client session
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;
      return session;
    },
  },

  // Point to your custom login UI
  pages: {
    signIn: "/login",
  },

  session: {
    strategy: "jwt",
  },

  secret: process.env.NEXTAUTH_SECRET,
};
