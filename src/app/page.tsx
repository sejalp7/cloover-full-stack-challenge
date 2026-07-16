import styles from "./Page.module.scss";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1 className={styles.brand}>GreenQuote</h1>
        <p className={styles.lede}>
          Solar financing pre-qualification. Quote form and results UI will live
          here.
        </p>
      </main>
    </div>
  );
}
