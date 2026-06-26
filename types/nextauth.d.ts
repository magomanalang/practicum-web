import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    user: {
      id: string;
      employeeId: string;
      email: string;
      firstName: string;
      lastName: string;
      role: string;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    employeeId: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    accessToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    employeeId: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    accessToken?: string;
  }
}
