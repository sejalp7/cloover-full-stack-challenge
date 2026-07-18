"use client";

import Link from "next/link";
import { Button } from "@/components/Button/Button";
import type { UserRole } from "@/types/user";
import styles from "./Header.module.scss";

export type HeaderProps = {
  title?: string;
  userName?: string | null;
  userRole?: UserRole | null;
  onLogout?: () => void;
};

export function Header({
  title = "GreenQuote",
  userName = null,
  userRole = null,
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
              {userRole === "admin" ? (
                <Link href="/admin/quotes" className={styles.navLink}>
                  Admin
                </Link>
              ) : null}
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
