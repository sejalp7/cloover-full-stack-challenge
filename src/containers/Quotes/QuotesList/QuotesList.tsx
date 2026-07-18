import Link from "next/link";
import { Table, type TableColumn } from "@/components/Table/Table";
import type { QuoteListItem } from "@/types/quote";
import styles from "./QuotesList.module.scss";

export type QuotesListProps = {
  quotes: QuoteListItem[];
  showUser?: boolean;
  caption?: string;
  emptyMessage?: string;
  detailHref?: (quote: QuoteListItem) => string;
};

function formatEur(value: number): string {
  return new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: "EUR",
  }).format(value);
}

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso));
}

export function QuotesList({
  quotes,
  showUser = false,
  caption = "Quotes",
  emptyMessage = "No quotes yet.",
  detailHref = (quote) => `/quotes/${quote.id}`,
}: QuotesListProps) {
  const columns: TableColumn<QuoteListItem>[] = [
    {
      key: "date",
      header: "Date",
      render: (row) => formatDate(row.createdAt),
    },
    ...(showUser
      ? [
          {
            key: "user",
            header: "User",
            render: (row: QuoteListItem) => (
              <span className={styles.userCell}>
                <span className={styles.userName}>{row.userFullName}</span>
                <span className={styles.userEmail}>{row.userEmail}</span>
              </span>
            ),
          } satisfies TableColumn<QuoteListItem>,
        ]
      : []),
    {
      key: "size",
      header: "System size",
      align: "right",
      render: (row) => `${row.systemSizeKw} kW`,
    },
    {
      key: "price",
      header: "Price",
      align: "right",
      render: (row) => formatEur(row.systemPrice),
    },
    {
      key: "band",
      header: "Band",
      align: "center",
      render: (row) => (
        <span className={styles.band} data-band={row.riskBand}>
          {row.riskBand}
        </span>
      ),
    },
    {
      key: "details",
      header: "Details",
      render: (row) => (
        <Link className={styles.detailLink} href={detailHref(row)}>
          View details
          <span className={styles.srOnly}>
            {" "}
            for quote from {formatDate(row.createdAt)}
          </span>
        </Link>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      rows={quotes}
      getRowId={(row) => row.id}
      caption={caption}
      emptyMessage={emptyMessage}
    />
  );
}
