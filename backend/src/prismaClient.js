import { PrismaClient } from '@prisma/client';

// Single Prisma client instance for the full backend app.
const prisma = new PrismaClient();

export default prisma;
