import NextAuth from "next-auth"
import { DefaultSession } from "next-auth"

declare module "next-auth" {

  interface Session {
    user: {
      id:      string
      role:    string | null    // null = new user, hasn't picked role yet
      mobile:  string | null    // added
      name?:   string
      email?:  string
      image?:  string
    } & DefaultSession["user"]  // keeps next-auth default fields safe
  }

  interface User {
    id:      string
    role:    string | null      // null for new users
    mobile?: string | null      // added
  }

}

declare module "next-auth/jwt" {
  interface JWT {
    id:      string
    role:    string | null      // null until edit-role is completed
    mobile:  string | null      // added
  }
}


