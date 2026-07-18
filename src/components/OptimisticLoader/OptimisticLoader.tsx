import styles from "./OptimisticLoader.module.scss";

export type OptimisticLoaderProps = {
  /** Accessible label announced while content is loading. */
  label?: string;
  /** Number of skeleton bars to render. */
  lines?: number;
  /** Optional fixed width (CSS length). Defaults to full width. */
  width?: string;
  /** Optional fixed height (CSS length). Defaults to 0.9rem. */
  height?: string;
  className?: string;
};

/**
 * Reusable shimmer skeleton for optimistic / pending UI states.
 */
export function OptimisticLoader({
  label = "Loading",
  lines = 1,
  width,
  height,
  className,
}: OptimisticLoaderProps) {
  const count = Math.max(1, lines);

  return (
    <div
      className={[styles.root, className ?? ""].filter(Boolean).join(" ")}
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label={label}
    >
      <span className={styles.srOnly}>{label}</span>
      {Array.from({ length: count }, (_, index) => (
        <span
          key={index}
          className={styles.bar}
          style={{
            width: width ?? (index === count - 1 && count > 1 ? "72%" : "100%"),
            height: height ?? "0.9rem",
          }}
        />
      ))}
    </div>
  );
}
