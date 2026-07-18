import { redirect } from "next/navigation";
import { Quotes } from "@/containers/Quotes/Quotes";
import { getSessionUser } from "@/lib/auth";
import { listQuotes } from "@/services/quote";

export default async function QuotesPage() {
  const user = await getSessionUser();
  if (!user) {
    redirect("/");
  }

  const quotes = await listQuotes(user);
  return <Quotes user={user} quotes={quotes} />;
}
