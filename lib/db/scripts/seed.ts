import "./_env";
import { db } from "../client";
import { authors } from "../schema";
import { bootstrapAdminPasswordIfMissing } from "../../auth-admin";
import fs from "fs";
import path from "path";

async function main() {
  await bootstrapAdminPasswordIfMissing();
  console.log("Admin password bootstrapped (or already set).");

  const authorsDir = path.join(process.cwd(), "content", "authors");
  if (fs.existsSync(authorsDir)) {
    const files = fs.readdirSync(authorsDir).filter((f) => f.endsWith(".json"));
    for (const file of files) {
      const data = JSON.parse(fs.readFileSync(path.join(authorsDir, file), "utf-8"));
      await db
        .insert(authors)
        .values(data)
        .onConflictDoUpdate({ target: authors.slug, set: data });
      console.log("Seeded author:", data.slug);
    }
  }
}

main()
  .then(() => {
    console.log("Seed complete.");
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
