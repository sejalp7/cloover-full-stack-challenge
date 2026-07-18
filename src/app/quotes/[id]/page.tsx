import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { QuotesDetail } from "@/containers/Quotes/QuotesDetails/QuotesDetail";
import { getSessionUser } from "@/lib/auth";
import { generateQuoteResponse } from "@/lib/quote-validation";
import { getQuoteById } from "@/services/quote";
import styles from "@/containers/Quotes/Quotes.module.scss";

type QuoteDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function QuoteDetailPage({ params }: QuoteDetailPageProps) {
  const user = await getSessionUser();
  if (!user) {
    redirect("/");
  }

  const { id } = await params;
  const quote = await getQuoteById(id, user);
  if (!quote) {
    notFound();
  }

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <p className={styles.eyebrow}>GreenQuote</p>
        <h1 className={styles.brand}>Quote details</h1>
        <p className={styles.lede}>
          System price, risk band, and installment offers.
        </p>
        <p className={styles.lede}>
          <Link href="/quotes">← Back to quotes</Link>
        </p>
        <QuotesDetail quote={generateQuoteResponse(quote)} />
      </main>
    </div>
  );
}
