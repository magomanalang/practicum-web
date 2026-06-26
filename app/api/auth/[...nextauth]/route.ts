import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        if (
          process.env.NODE_ENV === "development" &&
          credentials.email === "admin@local.com" &&
          credentials.password === "admin"
        ) {
          console.log("🛠️ Dev Admin Bypass Activated!");
          return {
            id: "dev-admin-id",
            name: "Local Dev Admin",
            email: "admin@local.com",
            role: "admin",
            employeeId: "DEV-ADMIN",
            firstName: "Local Dev",
            lastName: "Admin",
          };
        }
        try {
          const backendUrl = `${process.env.API_URL}/api/Employee/login-employee`;

          const res = await fetch(backendUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              Email: credentials.email,
              Password: credentials.password,
            }),
          });

          if (!res.ok) {
            console.error(`Backend returned status code: ${res.status}`);
            return null;
          }
          const user = await res.json();

          if (user) {
            return {
              id: user.id,
              email: user.email,
              employeeId: user.employeeId,
              firstName: user.firstName || user.FirstName,
              lastName: user.lastName || user.LastName,
              role: user.employeeRoles?.[0] || "User",
            };
          }
          return null;
        } catch (error) {
          console.error("Authentication failed:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.employeeId = user.employeeId;
        token.email = user.email;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.role = user.role;
        token.name = `${user.firstName} ${user.lastName}`;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.employeeId = token.employeeId as string;
        session.user.email = token.email as string;
        session.user.firstName = token.firstName as string;
        session.user.lastName = token.lastName as string;
        session.user.role = token.role as string;
        session.user.name = token.name as string;
      }
      return session;
    },
  },
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
});

export { handler as GET, handler as POST };
