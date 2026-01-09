import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name', { length: 120 }).notNull(),
  birthday: text('birthday').notNull(),
  gender: text('gender', { enum: ['male', 'female', 'other'] }).notNull(),
  country: text('country', { length: 120 }).notNull(),
});

export const authUsers = sqliteTable('auth_users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  email: text('email', { length: 160 }).notNull().unique(),
  passwordHash: text('password_hash', { length: 255 }).notNull(),
  role: text('role', { enum: ['admin', 'user'] }).notNull(),
  tokenVersion: integer('token_version').notNull().default(0),
});

export type UserRow = typeof users.$inferSelect;
export type NewUserRow = typeof users.$inferInsert;
export type AuthUserRow = typeof authUsers.$inferSelect;
export type NewAuthUserRow = typeof authUsers.$inferInsert;
