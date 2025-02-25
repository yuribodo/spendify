import { PrismaClient } from "@prisma/client";
import { env } from "@/env/index.js";

export const prisma = new PrismaClient({
    log: env.NODE_ENV === 'dev' ? ['query'] : [],
})