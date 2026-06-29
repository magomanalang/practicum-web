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
      employeeRoles: string[];
      createdBy: string;
      createdDateTime: Date;
      approvedBy: string;
      approvedDateTime: Date;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    employeeId: string;
    email: string;
    firstName: string;
    lastName: string;
    employeeRoles: string[];
    createdBy: string;
    createdDateTime: Date;
    approvedBy: string;
    approvedDateTime: Date;
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
    employeeRoles: string[];
    createdBy: string;
    createdDateTime: Date;
    approvedBy: string;
    approvedDateTime: Date;
    accessToken?: string;
  }
}
