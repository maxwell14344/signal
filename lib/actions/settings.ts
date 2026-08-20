"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db/client";
import { settings } from "@/lib/db/schema";

export async function updateSiteSettingsAction(
  _prevState: { error?: string; success?: boolean } | undefined,
  formData: FormData
): Promise<{ error?: string; success?: boolean }> {
  try {
    const toolsPerPage = Number(formData.get("toolsPerPage") ?? 12);
    const homepageCategorySlugs = formData.getAll("homepageCategorySlugs").map(String);
    const contactEmail = String(formData.get("contactEmail") ?? "").trim();

    if (!Number.isFinite(toolsPerPage) || toolsPerPage < 1 || toolsPerPage > 100) {
      return { error: "Tools per page must be a number between 1 and 100." };
    }
    if (contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail)) {
      return { error: "Please enter a valid contact email address." };
    }

    const value = JSON.stringify({ toolsPerPage, homepageCategorySlugs, contactEmail });

    await db
      .insert(settings)
      .values({ key: "site_settings", value })
      .onConflictDoUpdate({ target: settings.key, set: { value } });

    revalidatePath("/");
    revalidatePath("/tools");
    return { success: true };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to save." };
  }
}
