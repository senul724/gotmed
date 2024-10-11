"use client";

/* eslint @typescript-eslint/no-unused-vars: off */
/* eslint @typescript-eslint/ban-ts-comment: off */
/* eslint @typescript-eslint/no-explicit-any: off */

import { type QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { loggerLink, unstable_httpBatchStreamLink } from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";
import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import { useState } from "react";
import SuperJSON from "superjson";
import type { AppRouter } from "@/server/api/root";
import { createQueryClient } from "./query-client";
import { accessHKey, newAccessHKey } from "@/lib/utils/key";
import { refreshToken } from "@/lib/utils/auth";
import { JWTToken } from "@/lib/utils/jwt/base";

let clientQueryClientSingleton: QueryClient | undefined = undefined;
const getQueryClient = () => {
  if (typeof window === "undefined") {
    // Server: always make a new query client
    return createQueryClient();
  }
  // Browser: use singleton pattern to keep the same query client
  return (clientQueryClientSingleton ??= createQueryClient());
};

export const api = createTRPCReact<AppRouter>();

/**
 * Inference helper for inputs.
 *
 * @example type HelloInput = RouterInputs['example']['hello']
 */
export type RouterInputs = inferRouterInputs<AppRouter>;

/**
 * Inference helper for outputs.
 *
 * @example type HelloOutput = RouterOutputs['example']['hello']
 */
export type RouterOutputs = inferRouterOutputs<AppRouter>;

type NestedProcedureKey<T> = T extends object ? {
    [K in keyof T]: K extends string
      // biome-ignore lint/suspicious/noExplicitAny: generating types for all available procedures
      ? T[K] extends (...args: any[]) => any ? K
      : `${K}.${NestedProcedureKey<T[K]>}`
      : never;
  }[keyof T]
  : never;

// @ts-ignore
const protectedProcedures: NestedProcedureKey<AppRouter>[] = [
  "users.get",
];

export function TRPCReactProvider(props: { children: React.ReactNode }) {
  const queryClient = getQueryClient();

  const [trpcClient] = useState(() => {
    let accessToken: string | null = null;

    return api.createClient({
      links: [
        loggerLink({
          enabled: (op) =>
            process.env.NODE_ENV === "development" ||
            (op.direction === "down" && op.result instanceof Error),
        }),
        unstable_httpBatchStreamLink({
          transformer: SuperJSON,
          url: `${getBaseUrl()}/api/trpc`,
          headers: async ({ opList }) => {
            const headers = new Headers();
            headers.set("x-trpc-source", "nextjs-react");
            const requiresAuth = opList.some((op) =>
              protectedProcedures.some((proc) => op.path.startsWith(proc))
            );

            if (requiresAuth) {
              if (!accessToken || !JWTToken.isTokenExpired(accessToken)) {
                const newAccessToken = await refreshToken();
                if (newAccessToken) {
                  accessToken = newAccessToken;
                }
              }

              headers.set(accessHKey, accessToken ?? "");
            }
            return headers;
          },
          fetch: async (url, options) => {
            const response = await fetch(url, {
              ...options,
              credentials: "include",
            });

            const newAccessToken = response.headers.get(newAccessHKey);
            if (newAccessToken) {
              accessToken = newAccessToken;
            }

            return response;
          },
        }),
      ],
    });
  });

  return (
    <QueryClientProvider client={queryClient}>
      <api.Provider client={trpcClient} queryClient={queryClient}>
        {props.children}
      </api.Provider>
    </QueryClientProvider>
  );
}

function getBaseUrl() {
  if (typeof window !== "undefined") return window.location.origin;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return `http://localhost:${process.env.PORT ?? 3000}`;
}
