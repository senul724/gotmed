import { sql } from "drizzle-orm";
import {
  boolean,
  integer,
  pgTableCreator,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const createTable = pgTableCreator((name) => `med_${name}`);

export const users = createTable("users", {
  id: varchar("id", { length: 26 })
    .default(sql`gen_ulid()`)
    .primaryKey(),
  name: varchar("name", { length: 200 }).notNull(),
  age: integer("age").notNull(),
  email: varchar("email", { length: 100 }).notNull().unique(),
  image: varchar("image", { length: 200 }),
  owner: boolean("owner").default(false).notNull(),
});

export const pharmacies = createTable("pharmacies", {
  id: varchar("id", { length: 26 })
    .default(sql`gen_ulid()`)
    .primaryKey(),
  name: varchar("name", { length: 200 }).notNull(),
  location: varchar("location", { length: 200 }).notNull(),
  region: varchar("region", { length: 10 }).notNull(),
  openDays: text("open_days").array().notNull(),
  rating: integer("rating").default(0).notNull(),
  stars: integer("stars").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const requests = createTable("requests", {
  id: varchar("id", { length: 26 })
    .default(sql`gen_ulid()`)
    .primaryKey(),
  content: text("content"),
  doc: varchar("doc", { length: 200 }),
  info: varchar("info", { length: 200 }),
  region: varchar("region", { length: 10 }).notNull(),
  range: integer("range").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const responses = createTable("responses", {
  id: varchar("id", { length: 26 })
    .default(sql`gen_ulid()`)
    .primaryKey(),
  request: varchar("request", { length: 26 }).references(() => requests.id),
  from: varchar("from", { length: 26 }).references(() => pharmacies.id),
  lowStock: boolean("low_stock").default(false).notNull(),
  info: varchar("info", { length: 200 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
