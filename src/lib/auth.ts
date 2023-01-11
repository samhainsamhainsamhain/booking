export function getJwtSecretKey(): string {
  const secret = process.env.JWT_SECRET_KEY;

  if (!secret || secret.length === 0)
    throw new Error("JWT secret key is not defined");

  return secret;
}
