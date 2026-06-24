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

        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: credentials.email,
                password: credentials.password,
              }),
            },
          );

          if (!res.ok) {
            console.error(`Backend returned status code: ${res.status}`);
            return null;
          }
          const user = await res.json();
          if (user) {
            return user;
          }
          return null;
        } catch (error) {
          console.error("Authentication failed:", error);
          return null;
        }
      },
    }),
  ],

  pages: {
    signIn: "/login",
  },
});

export { handler as GET, handler as POST };
