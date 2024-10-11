import { decodeJwt } from "jose";
import { cookies } from "next/headers";
import {
  accessPrefix,
  refreshCookie,
  refreshPrefix,
  sessionCookie,
} from "@/lib/utils/key";
import { redis } from "@/services/redis/init";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const cookieStore = cookies();
  try {
    const session = cookieStore.get(sessionCookie)?.value;
    const refreshToken = cookieStore.get(refreshCookie)?.value;
    if (!session || !refreshToken) {
      return new Response("Cookies missing!", {
        status: 406,
      });
    }

    const refreshJti = decodeJwt(refreshToken).jti;
    const accessJti = await redis.get(refreshPrefix + refreshJti);

    await redis.del(refreshPrefix + refreshJti);
    await redis.del(accessPrefix + String(accessJti));

    cookieStore.delete(sessionCookie);
    cookieStore.delete(refreshCookie);

    return new Response(JSON.stringify("successfully logged out!"), {
      status: 200,
    });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ e }), {
      status: 500,
    });
  }
}
