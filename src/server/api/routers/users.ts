import { eq } from "drizzle-orm";
import { authorizedProcedure, createTRPCRouter } from "@/server/api/trpc";
import { users } from "@/server/db/schema";

export const usersRouter = createTRPCRouter({
  get: authorizedProcedure.query(async ({ ctx }) => {
    const { user: userId, db } = ctx;
    try {
      const userData = await db.query.users.findFirst({
        where: eq(users.id, userId.id),
      });
      return userData;
    } catch {
      return;
    }
  }),
});
