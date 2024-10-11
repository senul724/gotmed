import { decodeJwt, importPKCS8, importSPKI, jwtVerify, SignJWT } from "jose";
import { env } from "@/env";
import { base64URLDecode } from "../base64";
import { CustomeClaims, JWTFinalPayload } from "@/lib/types/jwt";

export const ALG = "RS256";
export const DAY_IN_SECONDS = 86400;

export const createJWT = async (
  pvtKey: string,
  jti: string,
  claims: CustomeClaims,
  sub: string,
  expirationInDays: string,
) => {
  const secret = await importPKCS8(base64URLDecode(pvtKey), ALG);
  const token = await new SignJWT({ ...claims })
    .setProtectedHeader({ alg: ALG })
    .setJti(jti)
    .setSubject(sub)
    .setIssuedAt()
    .setExpirationTime(expirationInDays)
    .setIssuer(env.DOMAIN)
    .setAudience(env.DOMAIN)
    .sign(secret);

  return {
    token,
  };
};

export const verifyJWT = async (pubKey: string, jwt: string) => {
  const secret = await importSPKI(base64URLDecode(pubKey), ALG);

  try {
    const { payload } = await jwtVerify(jwt, secret, {
      issuer: env.DOMAIN,
      audience: env.DOMAIN,
    });

    return {
      payload,
    };
  } catch (error) {
    console.error(error);
    return {
      payload: null,
    };
  }
};

export class JWTToken {
  public readonly expInSeconds: number;
  public readonly expIndays: number;
  protected readonly pvtKey: string;
  protected readonly pubKey: string;

  public constructor(
    expIndays: number,
    pvtKey: string,
    pubKey: string,
  ) {
    this.expIndays = expIndays;
    this.expInSeconds = DAY_IN_SECONDS * expIndays;
    this.pvtKey = pvtKey;
    this.pubKey = pubKey;
  }
  public async create(
    props: { jti: string; userId: string; claims: CustomeClaims },
  ): Promise<{ token?: string }> {
    const { userId, jti, claims } = props;

    try {
      return await createJWT(
        this.pvtKey,
        jti,
        claims,
        userId,
        `${this.expIndays}d`,
      );
    } catch (e) {
      console.error(e);
      return {};
    }
  }

  public async verify(
    props: { token: string },
  ): Promise<{ payload: JWTFinalPayload | null }> {
    const { token } = props;

    try {
      const payload = (await verifyJWT(
        this.pubKey,
        token,
      )).payload as null | JWTFinalPayload;

      return { payload };
    } catch (e) {
      console.error(e);
      return { payload: null };
    }
  }

  public static isTokenExpired(token: string): boolean {
    try {
      const jwt = decodeJwt(token);
      if (!jwt.exp) {
        return true;
      }

      return jwt.exp < Math.floor(new Date().getTime() / 1000);
    } catch (error) {
      console.error(error);
      return true;
    }
  }
}
