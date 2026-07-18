import { redirect } from "next/navigation";
import { AdminQuotes } from "@/containers/Quotes/AdminQuotes/AdminQuotes";
import { getSessionUser } from "@/lib/auth";
import { listQuotes } from "@/services/quote";

export default async function AdminQuotesPage() {
  const user = await getSessionUser();
  if (!user) {
    redirect("/");
  }
  if (user.role !== "admin") {
    redirect("/quotes");
  }

  const quotes = await listQuotes(user);
  return <AdminQuotes quotes={quotes} />;
}
