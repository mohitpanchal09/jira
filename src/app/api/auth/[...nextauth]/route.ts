import NextAuth, { AuthOptions } from "next-auth";
import { authOptions } from "./authOptions";

declare module "next-auth" {
  interface Session {
    user: {
      id: number;
      email: string;
      username: string;
    };
  }

  interface User {
    id: number;
    email: string;
    username: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: number;
    email: string;
    username: string;
  }
}



const handler = NextAuth(authOptions as AuthOptions);

export { handler as GET, handler as POST };
