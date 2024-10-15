import { pgTableCreator, varchar } from "drizzle-orm/pg-core";

export const createTable = pgTableCreator((name) => `med_${name}`);

export const users = createTable("users", {
  id: varchar("id", { length: 40 }).primaryKey(),
  name: varchar("name", { length: 200 }).notNull(),
  email: varchar("email", { length: 100 }).notNull().unique(),
  image: varchar("image", { length: 200 }),
});
