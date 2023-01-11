import { jwtVerify } from "jose";

type UserJwtPayload = {
  jti: string;
  iat: number;
};

export function getJwtSecretKey(): string {
  const secret = process.env.JWT_SECRET_KEY;

  if (!secret || secret.length === 0)
    throw new Error("JWT secret key is not defined");

  return secret;
}

export async function verifyAuth(token: string) {
  try {
    const verified = await jwtVerify(
      token,
      new TextEncoder().encode(getJwtSecretKey())
    );

    return verified.payload as UserJwtPayload;
  } catch (error) {
    throw new Error("Your token is invalid");
  }
}
