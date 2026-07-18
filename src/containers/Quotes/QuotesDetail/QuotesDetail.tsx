"use client";

import { Button } from "@/components/Button/Button";
import { Card } from "@/components/Card/Card";
import { Table, type TableColumn } from "@/components/Table/Table";
import type { QuoteOffer, QuoteResponse } from "@/types/quote";
import styles from "./QuotesDetail.module.scss";

export type QuotesDetailProps = {
  quote: QuoteResponse;
  onReset?: () => void;
};

function formatEur(value: number): string {
  return new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: "EUR",
  }).format(value);
}

const offerColumns: TableColumn<QuoteOffer>[] = [
  {
    key: "term",
    header: "Term",
    render: (row) => `${row.termYears} years`,
  },
  {
    key: "apr",
    header: "APR",
    align: "right",
    render: (row) => `${row.apr.toFixed(1)}%`,
  },
  {
    key: "monthly",
    header: "Monthly payment",
    align: "right",
    render: (row) => formatEur(row.monthlyPayment),
  },
];

export function QuotesDetail({ quote, onReset }: QuotesDetailProps) {
  return (
    <Card
      className={styles.card}
      title="Quote results"
      subtitle="Your solar financing pre-qualification."
      actions={
        onReset ? (
          <Button type="button" variant="secondary" onClick={onReset}>
            New quote
          </Button>
        ) : null
      }
    >
      <dl className={styles.summary}>
        <div className={styles.stat}>
          <dt>System price</dt>
          <dd>{formatEur(quote.derived.systemPrice)}</dd>
        </div>
        <div className={styles.stat}>
          <dt>Risk band</dt>
          <dd>
            <span className={styles.riskBand} data-band={quote.derived.riskBand}>
              {quote.derived.riskBand}
            </span>
          </dd>
        </div>
      </dl>

      <Table
        columns={offerColumns}
        rows={quote.offers}
        getRowId={(row) => String(row.termYears)}
        caption="Installment offers"
      />
    </Card>
  );
}
