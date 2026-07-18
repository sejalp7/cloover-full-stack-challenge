"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import axios from "axios";
import { Button } from "@/components/Button/Button";
import { Card } from "@/components/Card/Card";
import { Input } from "@/components/Input/Input";
import { apiClient } from "@/lib/api";
import type { SessionUser } from "@/types/user";
import styles from "../Login/LoginForm.module.scss";

type RegisterResponse = {
  id: string;
  email: string;
  fullName: string;
  role: SessionUser["role"];
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 6;

export function RegisterForm() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullNameError, setFullNameError] = useState<string | undefined>();
  const [emailError, setEmailError] = useState<string | undefined>();
  const [passwordError, setPasswordError] = useState<string | undefined>();
  const [formError, setFormError] = useState<string | undefined>();
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(undefined);

    const trimmedName = fullName.trim();
    const trimmedEmail = email.trim();

    const nextFullNameError = trimmedName ? undefined : "Full name is required";
    let nextEmailError: string | undefined;
    if (!trimmedEmail) {
      nextEmailError = "Email is required";
    } else if (!EMAIL_PATTERN.test(trimmedEmail)) {
      nextEmailError = "Enter a valid email";
    }
    let nextPasswordError: string | undefined;
    if (!password) {
      nextPasswordError = "Password is required";
    } else if (password.length < MIN_PASSWORD_LENGTH) {
      nextPasswordError = `Password must be at least ${MIN_PASSWORD_LENGTH} characters`;
    }

    setFullNameError(nextFullNameError);
    setEmailError(nextEmailError);
    setPasswordError(nextPasswordError);
    if (nextFullNameError || nextEmailError || nextPasswordError) {
      return;
    }

    setSubmitting(true);
    try {
      await apiClient.post<RegisterResponse>("/auth/register", {
        fullName: trimmedName,
        email: trimmedEmail,
        password,
      });

      router.push("/quotes");
      router.refresh();
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 409) {
        setFormError("An account with this email already exists.");
      } else {
        setFormError("Could not create your account. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card
      className={styles.card}
      title="Create account"
      subtitle="Register to request a solar financing quote."
    >
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <Input
          id="register-full-name"
          label="Full name"
          autoComplete="name"
          value={fullName}
          onChange={(event) => setFullName(event.target.value)}
          error={fullNameError}
          placeholder="Jane Doe"
        />
        <Input
          id="register-email"
          label="Email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          error={emailError}
          placeholder="you@example.com"
        />
        <Input
          id="register-password"
          label="Password"
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          error={passwordError}
          placeholder="At least 6 characters"
        />

        {formError ? (
          <p className={styles.formError} role="alert">
            {formError}
          </p>
        ) : null}

        <Button type="submit" fullWidth showChevron disabled={submitting}>
          {submitting ? "Creating account…" : "Create account"}
        </Button>

        <p className={styles.hint}>
          Already have an account? <Link href="/">Sign in</Link>
        </p>
      </form>
    </Card>
  );
}
