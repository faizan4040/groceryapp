import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import connectDB from "@/lib/db";
import User from "@/models/user.models";
import bcrypt from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({

  providers: [

    // Credentials Login
    Credentials({
      name: "credentials",

      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        await connectDB();

        const email = credentials?.email as string;
        const password = credentials?.password as string;

        const user = await User.findOne({ email });

        if (!user) throw new Error("User does not exist");

        // Important: check password exists (Google users don't have it)
        if (!user.password) {
          throw new Error("Please login with Google");
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) throw new Error("Incorrect password");

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role ?? null,
          mobile: user.mobile ?? null,
        };
      },
    }),

    // Google Login
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

  ],

  callbacks: {

    // Google SignIn
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        await connectDB();

        let dbUser = await User.findOne({ email: user.email });

        if (!dbUser) {
          dbUser = await User.create({
            name: user.name,
            email: user.email,
            image: user.image || "",
            role: null,     
            mobile: null,
          });
        }

        // Attach DB values to session user
        user.id = dbUser._id.toString();
        user.role = dbUser.role ?? null;
        user.mobile = dbUser.mobile ?? null;
      }

      return true;
    },

    // JWT
    async jwt({ token, user, trigger, session }) {

      // First login
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.role = user.role ?? null;
        token.mobile = user.mobile ?? null;
      }

      // Update session after role/mobile update
      if (trigger === "update") {
        if (session?.role) token.role = session.role;
        if (session?.mobile) token.mobile = session.mobile;
      }

      return token;
    },

    // Session
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.role = (token.role as string) || null;
        session.user.mobile = (token.mobile as string) || null;
      }
      return session;
    },

  },

  pages: {
    signIn: "/login",
    error: "/login",
  },

  session: {
    strategy: "jwt",
    maxAge: 10 * 24 * 60 * 60, 
  },

  secret: process.env.AUTH_SECRET,
});