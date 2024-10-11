import { eq } from "drizzle-orm";
import { OAuth2Client } from "google-auth-library";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { ulid } from "ulid";
import { env } from "@/env";
import {
  AccessToken,
  RefreshToken,
  SessionToken,
} from "@/lib/utils/jwt/tokens";
import {
  accessPrefix,
  refreshCookie,
  refreshPrefix,
  sessionCookie,
} from "@/lib/utils/key";
import { db } from "@/server/db";
import { users } from "@/server/db/schema";
import { redis } from "@/services/redis/init";

export async function POST(req: NextRequest) {
  const session = cookies().get(sessionCookie);
  if (session) {
    return new Response("Logged session available!", {
      status: 406,
    });
  }
  const code = req.headers.get("X-GOOGLE-ID-TOKEN");
  if (!code) {
    return new Response("Bad request", {
      status: 400,
    });
  }

  try {
    console.log("got token: ", code);
    const client = new OAuth2Client(
      env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      env.GOOGLE_CLIENT_SCRT,
      "http://localhost:3000",
    );
    const { tokens } = await client.getToken(code);
    console.log("got real token: ", tokens);

    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token ?? "",
      audience: env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    if (!(payload?.name && payload?.email)) {
      return new Response("Failed to get google payload!", {
        status: 500,
      });
    }

    console.log(payload);

    const { name, email, picture: image } = payload;

    const isAvailable = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    let userId = isAvailable?.id;

    if (!userId) {
      userId = ulid();
      await db.insert(users).values({
        name,
        email,
        image,
        id: userId,
      });
    }

    const refreshJti = ulid();
    const accessJti = ulid();
    const sessionJti = ulid();

    const claims = { name, email, image };

    const { token: newRefreshToken } = await RefreshToken.create({
      userId,
      jti: refreshJti,
      claims,
    });
    if (!newRefreshToken) {
      return new Response("Failed to generate token", { status: 500 });
    }

    const { token: newAccessToken } = await AccessToken.create({
      userId,
      jti: accessJti,
      claims,
    });
    if (!newAccessToken) {
      return new Response("Failed to generate token", { status: 500 });
    }

    await redis.set(refreshPrefix + refreshJti, accessJti, {
      ex: RefreshToken.expInSeconds,
    });

    await redis.set(accessPrefix + accessJti, userId, {
      ex: AccessToken.expInSeconds,
    });

    const { token: newSessionToken } = await SessionToken.create({
      userId,
      jti: sessionJti,
      claims,
    });
    if (!newSessionToken) {
      return new Response("Failed to generate token", { status: 500 });
    }

    cookies().set(sessionCookie, newSessionToken, {
      maxAge: SessionToken.expInSeconds,
    });
    cookies().set(refreshCookie, newRefreshToken, {
      maxAge: RefreshToken.expInSeconds,
      httpOnly: true,
    });

    return new Response("Login successfull!", {
      status: 200,
      headers: {
        "X_NEW_ACCESS_TOKEN": newAccessToken,
      },
    });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ e }), {
      status: 500,
    });
  }
}
