"use client";

import { useState } from "react";
import Link from "next/link";
import type { QuoteListItem, QuoteResponse } from "@/types/quote";
import type { SessionUser } from "@/types/user";
import { QuotesDetail } from "./QuotesDetail/QuotesDetail";
import { QuotesForm } from "./QuotesForm/QuotesForm";
import { QuotesList } from "./QuotesList/QuotesList";
import styles from "./Quotes.module.scss";

export type QuotesProps = {
  user: SessionUser;
  /** When provided, renders the user's quotes table instead of the create form. */
  quotes?: QuoteListItem[];
  /** Shows OptimisticLoader inside QuotesList while quotes are fetching. */
  listLoading?: boolean;
};

export function Quotes({ user, quotes, listLoading = false }: QuotesProps) {
  const [quote, setQuote] = useState<QuoteResponse | null>(null);

  if (quotes !== undefined || listLoading) {
    return (
      <div className={styles.pageWide}>
        <main className={styles.mainWide}>
          <div className={styles.headingRow}>
            <div>
              <p className={styles.heading}>GreenQuote</p>
              <h1 className={styles.brand}>My quotes</h1>
              <p className={styles.tagline}>
                Your solar financing pre-qualifications.
              </p>
            </div>
            <Link href="/quotes/new" className={styles.primaryLink}>
              New quote <span aria-hidden="true">›</span>
            </Link>
          </div>

          <QuotesList
            quotes={quotes ?? []}
            isLoading={listLoading}
            caption="Your quotes"
            emptyMessage="You have not created any quotes yet."
          />
        </main>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <p className={styles.heading}>GreenQuote</p>
        <h1 className={styles.brand}>
          {quote ? "Your pre-qualification" : "Request a quote"}
        </h1>
        <p className={styles.tagline}>
          {quote
            ? "Review your system price, risk band, and installment offers."
            : "Tell us about your property and system to get financing offers."}
        </p>

        {quote ? (
          <>
            <QuotesDetail quote={quote} onReset={() => setQuote(null)} />
            <p className={styles.tagline}>
              <Link href={`/quotes/${quote.id}`}>Open quote details page</Link>
              {" · "}
              <Link href="/quotes">View all my quotes</Link>
            </p>
          </>
        ) : (
          <QuotesForm user={user} onSuccess={setQuote} />
        )}
      </main>
    </div>
  );
}
