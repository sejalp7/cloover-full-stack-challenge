"use client";

import Link from "next/link";
import { Button } from "@/components/Button/Button";
import styles from "./Header.module.scss";

export type HeaderProps = {
  title?: string;
  userName?: string | null;
  onLogout?: () => void;
};

export function Header({
  title = "GreenQuote",
  userName = null,
  onLogout,
}: HeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <div className={styles.brandBlock}>
          <Link href={userName ? "/quotes" : "/"} className={styles.brand}>
            {title}
          </Link>
          {userName ? (
            <nav className={styles.nav} aria-label="Main">
              <Link href="/quotes" className={styles.navLink}>
                My quotes
              </Link>
              <Link href="/quotes/new" className={styles.navLink}>
                New quote
              </Link>
            </nav>
          ) : null}
        </div>

        <div className={styles.userArea}>
          {userName ? (
            <>
              <span className={styles.userName} title={userName}>
                {userName}
              </span>
              <Button
                variant="ghost"
                type="button"
                onClick={onLogout}
                aria-label="Log out"
              >
                Logout
              </Button>
            </>
          ) : (
            <Link href="/" className={styles.loginLink}>
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
