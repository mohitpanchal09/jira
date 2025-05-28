import { AuthProvider } from "@/generated/prisma";
import { prisma } from "@/lib/db";
import { AuthOptions } from "next-auth";
import bcrypt from "bcryptjs";
import CredentialsProvider from "next-auth/providers/credentials";
import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      //@ts-ignore
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          throw new Error("Please provide both username and password");
        }

        try {
          const user = await prisma.user.findUnique({
            where: {
              username: credentials.username,
              provider: AuthProvider.CREDENTIALS
            },
          });

          if (!user) {
            throw new Error("No user found with that username");
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
    GithubProvider({
      clientId: String(process.env.GITHUB_CLIENT_ID),
      clientSecret: String(process.env.GITHUB_CLIENT_SECRET),
    }),
    GoogleProvider({
      clientId: String(process.env.GOOGLE_CLIENT_ID),
      clientSecret: String(process.env.GOOGLE_CLIENT_SECRET)
    })
  ],
  secret: "next_auth_secret",
  session: {
    strategy: "jwt",
    maxAge: 30 * 60 * 60
  },
  pages: {
    signIn: "/sign-in",
  },
  callbacks: {

    async signIn({ user, account, profile }) {
      if (account?.provider === 'github') {
        const githubUsername = (profile as any)?.login || user.name;

        const existingUser = await prisma.user.findUnique({
          where: { username: githubUsername },
        });

        if (!existingUser) {
          const res = await prisma.user.create({
            data: {
              email: user.email,
              username: githubUsername,
              provider: AuthProvider.GITHUB,
              password: "",
            },
          });
          user.id = res.id
          user.username = githubUsername

        } else {
          user.id = existingUser.id;
          user.username = existingUser.username;
        }
      }
      if (account?.provider === 'google') {
        const existingUser = await prisma.user.findFirst({
          where: {
            AND: [
              { email: profile?.email },
              {
                OR: [
                  { provider: AuthProvider.CREDENTIALS },
                  { provider: AuthProvider.GOOGLE },
                ],
              },
            ],
          },
        });
        if (!existingUser) {
          const newUser = await prisma.user.create({
            data: {
              email: profile?.email,
              username: profile?.email?.split('@')[0] || "",
              provider: AuthProvider.GOOGLE,
              password: "", // or null if allowed
            },
          });

          user.id = newUser.id;
          user.username = newUser.username;
        } else {
          user.id = existingUser.id;
          user.username = existingUser.username;
        }
      }

      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id as number;
        token.email = user.email;
        token.username = (user as any).username; 
      }
      return token;
    },

    async session({ session, token }: any) {
      if (token) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.username = token.username
      }
      return session;
    },
  },

}