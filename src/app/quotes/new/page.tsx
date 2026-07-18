import { redirect } from "next/navigation";
import { Quotes} from "@/containers/Quotes/Quotes";
import { getSessionUser } from "@/lib/auth";

export default async function NewQuotePage() {
  const user = await getSessionUser();
  if (!user) {
    redirect("/");
  }

  return <Quotes user={user} />;
}
