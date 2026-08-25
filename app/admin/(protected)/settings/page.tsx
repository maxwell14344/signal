import { ChangePasswordForm } from "@/components/admin/ChangePasswordForm";
import { SiteSettingsForm } from "@/components/admin/SiteSettingsForm";
import {
  getSiteSettings,
  getAllCategories,
  getAllTools,
  getAllComparisonsWithNames,
} from "@/lib/db/queries";

export default async function AdminSettingsPage() {
  const [settings, categories, tools, comparisons] = await Promise.all([
    getSiteSettings(),
    getAllCategories(),
    getAllTools(),
    getAllComparisonsWithNames(),
  ]);

  return (
    <div>
      <h1 className="text-xl">Settings</h1>

      <h2 className="mt-8 mb-4 text-sm font-medium text-foreground">Homepage &amp; site settings</h2>
      <SiteSettingsForm settings={settings} categories={categories} tools={tools} comparisons={comparisons} />

      <h2 className="mt-10 mb-4 text-sm font-medium text-foreground">Change admin password</h2>
      <ChangePasswordForm />
    </div>
  );
}
