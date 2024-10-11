import "server-only";

import type { JWTFinalPayload } from "@/lib/types/jwt";
import { JWTToken, verifyJWT } from "./base";
import { env } from "@/env";
import { accessPrefix } from "../key";
import { redis } from "@/services/redis/init";

class AccessJWTToken extends JWTToken {
  public constructor(expIndays: number, pvtKey: string, pubKey: string) {
    super(expIndays, pvtKey, pubKey);
  }

  public async deepVerify(props: { token: string }): Promise<{
    payload: JWTFinalPayload | null;
  }> {
    const { token } = props;

    try {
      const payload = (await verifyJWT(this.pubKey, token))
        .payload as null | JWTFinalPayload;

      if (!payload) {
        return { payload };
      }

      const owner = await redis.get(accessPrefix + payload.jti);
      if (owner !== payload.sub) {
        throw new Error("unathorized!");
      }

      return { payload };
    } catch (e) {
      console.error(e);
      return { payload: null };
    }
  }
}

export const AccessToken = new AccessJWTToken(
  1,
  env.ACCESS_PVT_KEY,
  env.NEXT_PUBLIC_ACCESS_PUB_KEY,
);

export const RefreshToken = new JWTToken(
  30,
  env.REFRESH_PVT_KEY,
  env.NEXT_PUBLIC_REFRESH_PUB_KEY,
);

export const SessionToken = new JWTToken(
  30,
  env.SESSION_PVT_KEY,
  env.NEXT_PUBLIC_SESSION_PUB_KEY,
);
