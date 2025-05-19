import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
export const authOptions:AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      //@ts-ignore
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please provide both email and password");
        }

        try {
          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email,
            },
          });

          if (!user) {
            throw new Error("No user found with that email");
          }

          const isValid = await bcrypt.compare(credentials.password, user?.password as string);
          if (!isValid) {
            throw new Error("Invalid credentials");
          }

          return {
            id: user.id,
            username: user.username,
            email: user.email,
          };
        } catch (err) {
          if (err instanceof Error) {
            throw new Error(err.message);
          }
        
          throw new Error("Something went wrong.");
        }
      },
    }),
  ],
  secret: "next_auth_secret",
  session: {
    strategy: "jwt",
    maxAge:30*60*60 
  },
  pages: {
    signIn: "/sign-in",
  },
  callbacks: {
    async jwt({ token, user }:any) {
      if (user && user.email && user.id) {
        token.email = user.email;
        token.id = Number(user.id);
        token.username = user.username
      }
      return token;
    },

    async session({ session, token }:any) {
      if (token) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.username = token.username
      }
      return session;
    },
  },

}