import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "@shared/schema";

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL must be set. Did you forget to provision a database?");
  // In serverless/Vercel, we don't want to crash the entire function
  // if database is not configured yet
}

// Create pool with better error handling for serverless
export const pool = process.env.DATABASE_URL 
  ? new Pool({ 
      connectionString: process.env.DATABASE_URL,
      // Serverless-friendly settings
      max: 1,
      idleTimeoutMillis: 10000,
      connectionTimeoutMillis: 10000,
    })
  : null as any;

export const db = pool ? drizzle({ client: pool, schema }) : null as any;