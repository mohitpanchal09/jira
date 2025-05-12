// lib/db.ts
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient({
  log: ["query"],
});

export { prisma };
