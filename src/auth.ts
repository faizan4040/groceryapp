import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import connectDB from "@/lib/db";
import User from "@/models/user.models";
import bcrypt from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({

  providers: [

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

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) throw new Error("Incorrect password");

        return {
          id:    user._id.toString(),
          name:  user.name,
          email: user.email,
          role:  user.role ?? null,
        };
      },
    }),

    Google({
      clientId:     process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

  ],

  callbacks: {

    async signIn({ user, account }) {
      if (account?.provider === "google") {
        await connectDB();

        let dbUser = await User.findOne({ email: user.email });

        if (!dbUser) {
          // FIX 2: new Google users get role: null
          //    so middleware sends them to /edit-role
          dbUser = await User.create({
            name:   user.name,
            email:  user.email,
            image:  user.image,
            role:   null,    // was "user" before — this was the bug
            mobile: null,
          });
        }

        user.id   = dbUser._id.toString();
        user.role = dbUser.role ?? null;  // existing users keep their role
      }
      return true;
    },

    // FIX 3: handle update() call from EditRolemobile
    //    When user picks role, EditRolemobile calls:
    //    await update({ role: selectedRole, mobile })
    //    Without this trigger check, the JWT never updates
    //    and middleware keeps redirecting back to /edit-role forever
    async jwt({ token, user, trigger, session }) {

      // First sign-in — copy user fields into token
      if (user) {
        token.id    = user.id;
        token.name  = user.name;
        token.email = user.email;
        token.role  = user.role ?? null;
      }

      // Session update triggered by EditRolemobile → update()
      if (trigger === "update" && session?.role) {
        token.role   = session.role;
        token.mobile = session.mobile;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id     = token.id     as string;
        session.user.name   = token.name   as string;
        session.user.email  = token.email  as string;
        session.user.role   = (token.role  as string) ?? null;  
        session.user.mobile = token.mobile as string ?? null;
      }
      return session;
    },

  },

  pages: {
    signIn: "/login",
    error:  "/login",
  },

  session: {
    strategy: "jwt",
    maxAge:   10*24*60*60*1000,
  },

  secret: process.env.AUTH_SECRET,

});