import type { HTMLAttributes, ReactNode } from "react";
import styles from "./Card.module.scss";

export type CardProps = HTMLAttributes<HTMLElement> & {
  as?: "article" | "section" | "div";
  title?: string;
  subtitle?: string;
  actions?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
  padded?: boolean;
};

export function Card({
  as: Component = "article",
  title,
  subtitle,
  actions,
  footer,
  children,
  padded = true,
  className,
  ...rest
}: CardProps) {
  const classes = [
    styles.card,
    padded ? styles.padded : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Component className={classes} {...rest}>
      {(title || subtitle || actions) && (
        <header className={styles.header}>
          <div className={styles.heading}>
            {title ? <h2 className={styles.title}>{title}</h2> : null}
            {subtitle ? <p className={styles.subtitle}>{subtitle}</p> : null}
          </div>
          {actions ? <div className={styles.actions}>{actions}</div> : null}
        </header>
      )}
      <div className={styles.body}>{children}</div>
      {footer ? <footer className={styles.footer}>{footer}</footer> : null}
    </Component>
  );
}
