import { AdminLogin } from "@/components/admin/AdminLogin/AdminLogin";

export const metadata = { title: "New password — Yurix admin" };

// Opened from the emailed reset link (?token=…).
export default function ResetPasswordPage() {
  return <AdminLogin mode="newPassword" />;
}
