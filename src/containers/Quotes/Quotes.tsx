"use client";

import { useState } from "react";
import Link from "next/link";
import type { QuoteResponse } from "@/types/quote";
import type { SessionUser } from "@/types/user";
import { QuotesDetail } from "./QuotesDetails/QuotesDetail";
import { QuotesForm } from "./QuotesForm/QuotesForm";
import styles from "./Quotes.module.scss";

export type QuotesProps = {
  user: SessionUser;
};

export function Quotes({ user }: QuotesProps) {
  const [quote, setQuote] = useState<QuoteResponse | null>(null);

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <p className={styles.eyebrow}>GreenQuote</p>
        <h1 className={styles.brand}>
          {quote ? "Your pre-qualification" : "Request a quote"}
        </h1>
        <p className={styles.lede}>
          {quote
            ? "Review your system price, risk band, and installment offers."
            : "Tell us about your property and system to get financing offers."}
        </p>

        {quote ? (
          <>
            <QuotesDetail quote={quote} onReset={() => setQuote(null)} />
            <p className={styles.lede}>
              <Link href={`/quotes/${quote.id}`}>Open quote details page</Link>
            </p>
          </>
        ) : (
          <QuotesForm user={user} onSuccess={setQuote} />
        )}
      </main>
    </div>
  );
}
