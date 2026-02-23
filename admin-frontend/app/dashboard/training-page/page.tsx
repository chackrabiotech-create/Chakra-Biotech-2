import { redirect } from "next/navigation";

// Training page settings have been merged into /dashboard/training → "Page Settings" tab
export default function TrainingPageRedirect() {
  redirect("/dashboard/training");
}
