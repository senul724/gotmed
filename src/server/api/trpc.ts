import { initTRPC } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";
import { throwUnauthorizedIfNot } from "@/lib/utils/auth";
import { AccessToken } from "@/lib/utils/jwt/tokens";
import { accessHKey } from "@/lib/utils/key";

import { db } from "@/server/db";

/**
 * 1. CONTEXT
 *
 * This section defines the "contexts" that are available in the backend API.
 *
 * These allow you to access things when processing a request, like the database, the session, etc.
 *
 * This helper generates the "internals" for a tRPC context. The API handler and RSC clients each
 * wrap this and provides the required context.
 *
 * @see https://trpc.io/docs/server/context
 */
export const createTRPCContext = async (opts: {
  headers: Headers;
  user?: {
    id: string;
  };
}) => {
  return {
    db,
    ...opts,
  };
};

/**
 * 2. INITIALIZATION
 *
 * This is where the tRPC API is initialized, connecting the context and transformer. We also parse
 * ZodErrors so that you get typesafety on the frontend if your procedure fails due to validation
 * errors on the backend.
 */
const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError: error.cause instanceof ZodError
          ? error.cause.flatten()
          : null,
      },
    };
  },
});

/**
 * Create a server-side caller.
 *
 * @see https://trpc.io/docs/server/server-side-calls
 */
export const createCallerFactory = t.createCallerFactory;

/**
 * 3. ROUTER & PROCEDURE (THE IMPORTANT BIT)
 *
 * These are the pieces you use to build your tRPC API. You should import these a lot in the
 * "/src/server/api/routers" directory.
 */

/**
 * This is how you create new routers and sub-routers in your tRPC API.
 *
 * @see https://trpc.io/docs/router
 */
export const createTRPCRouter = t.router;

/**
 * Middleware for timing procedure execution and adding an artificial delay in development.
 *
 * You can remove this if you don't like it, but it can help catch unwanted waterfalls by simulating
 * network latency that would occur in production but not in local development.
 */
const timingMiddleware = t.middleware(async ({ next, path }) => {
  const start = Date.now();

  if (t._config.isDev) {
    // artificial delay in dev
    const waitMs = Math.floor(Math.random() * 400) + 100;
    await new Promise((resolve) => setTimeout(resolve, waitMs));
  }

  const result = await next();

  const end = Date.now();
  console.log(`[TRPC] ${path} took ${end - start}ms to execute`);

  return result;
});

function createPlugins() {
  return {
    tokenProc: t.procedure.use(async (opts) => {
      const accessToken = throwUnauthorizedIfNot(
        opts.ctx.headers.get(accessHKey),
      );
      const accessPayload = throwUnauthorizedIfNot(
        (
          await AccessToken.deepVerify({
            token: accessToken,
          })
        ).payload,
      );

      return opts.next({
        ctx: {
          user: {
            id: accessPayload.sub,
          },
        },
      });
    }),
  };
}
const plugin = createPlugins();

/**
 * Public (unauthenticated) procedure
 *
 * This is the base piece you use to build new queries and mutations on your tRPC API. It does not
 * guarantee that a user querying is authorized, but you can still access user session data if they
 * are logged in.
 */
export const publicProcedure = t.procedure.use(timingMiddleware);

/**
 * Authorized procedure
 * This procedure is used for queries and mutations that require a user to be logged in.
 */
export const authorizedProcedure = publicProcedure
  .unstable_concat(plugin.tokenProc)
  .use((opts) => {
    return opts.next({
      ctx: {
        ...opts.ctx,
        user: {
          id: opts.ctx.user.id,
        },
      },
    });
  });
