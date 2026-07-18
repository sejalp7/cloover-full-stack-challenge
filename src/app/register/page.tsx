import { redirect } from "next/navigation";
import { RegisterForm } from "@/containers/Register/RegisterForm";
import { getSessionUser } from "@/lib/auth";
import styles from "../Page.module.scss";

export default async function RegisterPage() {
  const user = await getSessionUser();
  if (user) {
    redirect("/quotes");
  }

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <p className={styles.eyebrow}>GreenQuote</p>
        <h1 className={styles.brand}>Register</h1>
        <p className={styles.tagline}>
          Create an account to get your solar financing pre-qualification.
        </p>
        <RegisterForm />
      </main>
    </div>
  );
}
