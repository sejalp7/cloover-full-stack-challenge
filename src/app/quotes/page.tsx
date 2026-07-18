import { Suspense } from "react";
import { redirect } from "next/navigation";
import { Quotes } from "@/containers/Quotes/Quotes";
import { getSessionUser } from "@/lib/auth";
import { listQuotes } from "@/services/quote";
import type { SessionUser } from "@/types/user";

async function QuotesListContent({ user }: { user: SessionUser }) {
  const quotes = await listQuotes(user);
  return <Quotes user={user} quotes={quotes} />;
}

export default async function QuotesPage() {
  const user = await getSessionUser();
  if (!user) {
    redirect("/");
  }

  return (
    <Suspense fallback={<Quotes user={user} listLoading />}>
      <QuotesListContent user={user} />
    </Suspense>
  );
}
