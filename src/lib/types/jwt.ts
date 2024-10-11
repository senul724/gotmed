export interface CustomeClaims {
  email: string;
  name: string;
  image?: string;
}

export interface JWTFinalPayload extends CustomeClaims {
  iat: number;
  exp: number;
  jti: string;
  iss: string;
  aud: string;
  sub: string;
}
