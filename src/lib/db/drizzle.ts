import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import { ensureSchema } from './migrate.ts';
import * as schema from './schema';

const sqlite = new Database('database.sqlite');
sqlite.pragma('foreign_keys = OFF');
ensureSchema(sqlite);
sqlite.pragma('foreign_keys = ON');

export const db = drizzle(sqlite, { schema });
