// file: src/server/auth/password.ts
import * as argon2 from "argon2";

export async function hashPassword(password: string): Promise<string> {
  return argon2.hash(password, {
    type: argon2.argon2id,
    timeCost: 3,
    memoryCost: 19456,
    parallelism: 1,
  });
}

/** Verify password. Supports argon2; also bcrypt if the package is installed (legacy). */
export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  const isBcrypt = /^\$2[aby]\$/.test(hash);
  if (isBcrypt) {
    try {
      const bcrypt = await import("bcrypt");
      return bcrypt.compare(password, hash);
    } catch {
      return false;
    }
  }
  try {
    return await argon2.verify(hash, password);
  } catch {
    return false;
  }
}
