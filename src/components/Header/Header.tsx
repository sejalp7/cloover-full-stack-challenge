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
  title = "Qreenqoute - solar financing",
  userName = null,
  onLogout,
}: HeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/" className={styles.brand}>
          {title}
        </Link>

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
