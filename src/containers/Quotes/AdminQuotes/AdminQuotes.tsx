import { QuotesList } from "@/containers/Quotes/QuotesList/QuotesList";
import type { QuoteListItem } from "@/types/quote";
import styles from "../Quotes.module.scss";

export type AdminQuotesProps = {
  quotes: QuoteListItem[];
};

export function AdminQuotes({ quotes }: AdminQuotesProps) {
  return (
    <div className={styles.pageWide}>
      <main className={styles.mainWide}>
        <p className={styles.heading}>Admin</p>
        <h1 className={styles.brand}>All quotes</h1>
        <p className={styles.tagline}>
          Review every solar financing pre-qualification.
        </p>

        <QuotesList
          quotes={quotes}
          showUser
          caption="All quotes"
          emptyMessage="No quotes have been created yet."
        />
      </main>
    </div>
  );
}
