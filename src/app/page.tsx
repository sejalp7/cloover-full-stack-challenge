import { LoginForm } from "@/containers/Login/LoginForm";
import styles from "./Page.module.scss";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <p className={styles.heading}>GreenQuote</p>
        <h1 className={styles.brand}>Sign in</h1>
        <p className={styles.tagline}>
         Get your solar financing pre-qualification quote.
        </p>
        <LoginForm />
      </main>
    </div>
  );
}
