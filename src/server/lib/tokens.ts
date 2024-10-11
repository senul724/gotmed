import "server-only";
import { AccessToken, RefreshToken } from "@/lib/utils/jwt/tokens";
import { accessPrefix, refreshPrefix } from "@/lib/utils/key";
import { redis } from "@/services/redis/init";
import { ulid } from "ulid";

export async function refresh(token: string): Promise<{
  token: string;
  status: "success" | "unauthorized" | "failed";
  user?: {
    id: string;
  };
}> {
  const { payload } = await RefreshToken.verify({ token });
  if (!payload) {
    return {
      token: "",
      status: "unauthorized",
    };
  }

  const pastAccessToken = await redis.get(refreshPrefix + payload.jti);
  if (!pastAccessToken) {
    return {
      token: "",
      status: "unauthorized",
    };
  }

  const { email, image, name } = payload;
  const accessJti = ulid();

  const { token: newAccessToken } = await AccessToken.create({
    jti: accessJti,
    userId: payload.sub,
    claims: { email, name, image },
  });

  if (!newAccessToken) {
    return {
      token: "",
      status: "failed",
    };
  }

  await redis.set(refreshPrefix + payload.jti, accessJti);
  await redis.set(accessPrefix + accessJti, payload.sub);

  return {
    token: newAccessToken,
    status: "success",
    user: {
      id: payload.sub,
    },
  };
}
