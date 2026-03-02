import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config(); // Lee las variables de .env

// Crear la instancia de Prisma con la URL desde .env
export const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});