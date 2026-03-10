import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import connectDB from "./lib/db";
import User from "./models/user.models";
import bcrypt from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "email", type: "email" },
        password: { label: "password", type: "password" },
      },

      async authorize(credentials) {
        try {
          await connectDB();

          const email = credentials?.email as string;
          const password = credentials?.password as string;

          const user = await User.findOne({ email });

          if (!user) {
            throw new Error("User does not exist");
          }

          const isMatch = await bcrypt.compare(password, user.password);

          if (!isMatch) {
            throw new Error("Incorrect password");
          }

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role,
          };

        } catch (error) {
          throw new Error("Authentication failed");
        }
      },
    }),
  ],

  callbacks: {
    // JWT me user ka data store karta hai
    async jwt({ token, user }) {
      if (user) {
        token.id=user.id;
        token.name=user.name;
        token.email=user.email;
        token.role=user.role;
      }
      return token;
    },
    session({ session, token }) {
        if (session.user) {
            session.user.id = token.id as string;
            session.user.name = token.name as string;
            session.user.email = token.email as string;
            session.user.role = token.role as string;
        }
        return session;
        }
        },
    pages:{
        signIn:"/login",
        error:"/login"
    },
    session:{
        strategy:'jwt',
        maxAge:10*24*60*60*1000
    },
    secret:process.env.AUTH_SECRET
});