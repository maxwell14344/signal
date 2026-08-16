import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { db } from "./db/client";
import { settings } from "./db/schema";

const PASSWORD_HASH_KEY = "admin_password_hash";

export async function getAdminPasswordHash(): Promise<string | null> {
  const rows = await db
    .select()
    .from(settings)
    .where(eq(settings.key, PASSWORD_HASH_KEY))
    .limit(1);
  return rows[0]?.value ?? null;
}

export async function setAdminPasswordHash(hash: string): Promise<void> {
  await db
    .insert(settings)
    .values({ key: PASSWORD_HASH_KEY, value: hash })
    .onConflictDoUpdate({ target: settings.key, set: { value: hash } });
}

export async function verifyAdminPassword(input: string): Promise<boolean> {
  const hash = await getAdminPasswordHash();
  if (!hash) return false;
  return bcrypt.compare(input, hash);
}

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, 12);
}

export async function bootstrapAdminPasswordIfMissing(): Promise<void> {
  const existing = await getAdminPasswordHash();
  if (existing) return;
  const initial = process.env.ADMIN_INITIAL_PASSWORD;
  if (!initial) throw new Error("ADMIN_INITIAL_PASSWORD is not set");
  await setAdminPasswordHash(await hashPassword(initial));
}
