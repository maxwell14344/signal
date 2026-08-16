import { ChangePasswordForm } from "@/components/admin/ChangePasswordForm";

export default function AdminSettingsPage() {
  return (
    <div>
      <h1 className="text-xl">Settings</h1>
      <h2 className="mt-6 mb-4 text-sm font-medium text-foreground">Change admin password</h2>
      <ChangePasswordForm />
    </div>
  );
}
