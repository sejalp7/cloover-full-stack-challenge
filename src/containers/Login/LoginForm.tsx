"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Button } from "@/components/Button/Button";
import { Card } from "@/components/Card/Card";
import { Input } from "@/components/Input/Input";
import { apiClient } from "@/lib/api";
import type { SessionUser } from "@/types/user";
import styles from "./LoginForm.module.scss";

type LoginResponse = {
  id: string;
  email: string;
  fullName: string;
  role: SessionUser["role"];
};

export type LoginFormProps = {
  onSuccess?: (user: SessionUser) => void;
};

export function LoginForm({ onSuccess }: LoginFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState<string | undefined>();
  const [passwordError, setPasswordError] = useState<string | undefined>();
  const [formError, setFormError] = useState<string | undefined>();
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(undefined);

    const nextEmailError = email.trim() ? undefined : "Email is required";
    const nextPasswordError = password ? undefined : "Password is required";
    setEmailError(nextEmailError);
    setPasswordError(nextPasswordError);
    if (nextEmailError || nextPasswordError) {
      return;
    }

    setSubmitting(true);
    try {
      const { data } = await apiClient.post<LoginResponse>("/auth/login", {
        email: email.trim(),
        password,
      });

      const user: SessionUser = {
        id: data.id,
        email: data.email,
        username: data.fullName,
        role: data.role,
      };

      onSuccess?.(user);
      router.push("/quotes");
      router.refresh();
    } catch {
      setFormError("Invalid email or password. Try the seeded test accounts.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card
      className={styles.card}
      title="Welcome"
    >
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <Input
          id="login-email"
          label="Email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          error={emailError}
          placeholder="user@test.com"
        />
        <Input
          id="login-password"
          label="Password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          error={passwordError}
          placeholder="••••••••"
        />

        {formError ? (
          <p className={styles.formError} role="alert">
            {formError}
          </p>
        ) : null}

        <Button type="submit" fullWidth showChevron disabled={submitting}>
          {submitting ? "Signing in…" : "Sign in"}
        </Button>

        <p className={styles.hint}>
          Seeded accounts: <code>user@test.com</code> / <code>user123</code>,{" "}
          <code>admin@test.com</code> / <code>admin123</code>
        </p>
      </form>
    </Card>
  );
}
