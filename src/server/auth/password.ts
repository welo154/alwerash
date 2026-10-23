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

let dummyHash: Promise<string> | null = null;

/**
 * Run a real password hash when the account does not exist, so a login attempt for
 * an unknown email takes about as long as a wrong password and does not reveal
 * which addresses are registered.
 */
export function verifyAgainstDummyPassword(password: string): Promise<boolean> {
  dummyHash ??= hashPassword("alwerash-timing-equalizer");
  return dummyHash.then((hash) => verifyPassword(password, hash));
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
