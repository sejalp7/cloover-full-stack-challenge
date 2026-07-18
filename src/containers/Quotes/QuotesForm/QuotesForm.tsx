"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Button } from "@/components/Button/Button";
import { Card } from "@/components/Card/Card";
import { Input } from "@/components/Input/Input";
import { apiClient } from "@/lib/api";
import type { QuoteResponse } from "@/types/quote";
import type { SessionUser } from "@/types/user";
import styles from "./QuotesForm.module.scss";

export type QuotesFormProps = {
  user: SessionUser;
  onSuccess: (quote: QuoteResponse) => void;
};

type FieldErrors = {
  address?: string;
  monthlyConsumptionKwh?: string;
  systemSizeKw?: string;
  downPayment?: string;
};

function parseRequiredPositive(value: string, label: string): { ok: true; value: number } | { ok: false; error: string } {
  const trimmed = value.trim();
  if (!trimmed) {
    return { ok: false, error: `${label} is required` };
  }
  const num = Number(trimmed);
  if (Number.isNaN(num)) {
    return { ok: false, error: `${label} must be a number` };
  }
  if (num <= 0) {
    return { ok: false, error: `${label} must be greater than 0` };
  }
  return { ok: true, value: num };
}

export function QuotesForm({ user, onSuccess }: QuotesFormProps) {
  const router = useRouter();
  const [address, setAddress] = useState("");
  const [monthlyConsumptionKwh, setMonthlyConsumptionKwh] = useState("");
  const [systemSizeKw, setSystemSizeKw] = useState("");
  const [downPayment, setDownPayment] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | undefined>();
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(undefined);

    const nextErrors: FieldErrors = {};
    const addressValue = address.trim();
    if (!addressValue) {
      nextErrors.address = "Address is required";
    }

    const consumption = parseRequiredPositive(
      monthlyConsumptionKwh,
      "Monthly consumption",
    );
    if (!consumption.ok) {
      nextErrors.monthlyConsumptionKwh = consumption.error;
    }

    const systemSize = parseRequiredPositive(systemSizeKw, "System size");
    if (!systemSize.ok) {
      nextErrors.systemSizeKw = systemSize.error;
    }

    let downPaymentValue: number | undefined;
    const downPaymentTrimmed = downPayment.trim();
    if (downPaymentTrimmed) {
      const num = Number(downPaymentTrimmed);
      if (Number.isNaN(num)) {
        nextErrors.downPayment = "Down payment must be a number";
      } else if (num < 0) {
        nextErrors.downPayment = "Down payment must be >= 0";
      } else {
        downPaymentValue = num;
      }
    }

    setFieldErrors(nextErrors);
    if (
      Object.keys(nextErrors).length > 0 ||
      !consumption.ok ||
      !systemSize.ok
    ) {
      return;
    }

    setSubmitting(true);
    try {
      const body: {
        address: string;
        monthlyConsumptionKwh: number;
        systemSizeKw: number;
        downPayment?: number;
      } = {
        address: addressValue,
        monthlyConsumptionKwh: consumption.value,
        systemSizeKw: systemSize.value,
      };
      if (downPaymentValue !== undefined) {
        body.downPayment = downPaymentValue;
      }

      const { data } = await apiClient.post<QuoteResponse>("/quotes", body);
      onSuccess(data);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        router.push("/");
        router.refresh();
        return;
      }
      setFormError("Failed to create quote. Please check your inputs and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card className={styles.card} title="New quote" subtitle="Get your solar financing pre-qualification.">
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <Input
          id="quote-full-name"
          label="Full name"
          value={user.username}
          readOnly
        />
        <Input
          id="quote-email"
          label="Email"
          type="email"
          value={user.email}
          readOnly
        />
        <Input
          id="quote-address"
          label="Address"
          value={address}
          onChange={(event) => setAddress(event.target.value)}
          error={fieldErrors.address}
          placeholder="Street, city"
          autoComplete="street-address"
        />
        <Input
          id="quote-monthly-consumption"
          label="Monthly consumption (kWh)"
          type="number"
          inputMode="decimal"
          min={0}
          step="any"
          value={monthlyConsumptionKwh}
          onChange={(event) => setMonthlyConsumptionKwh(event.target.value)}
          error={fieldErrors.monthlyConsumptionKwh}
          placeholder="e.g. 350"
        />
        <Input
          id="quote-system-size"
          label="System size (kW)"
          type="number"
          inputMode="decimal"
          min={0}
          step="any"
          value={systemSizeKw}
          onChange={(event) => setSystemSizeKw(event.target.value)}
          error={fieldErrors.systemSizeKw}
          placeholder="e.g. 5"
        />
        <Input
          id="quote-down-payment"
          label="Down payment (optional)"
          type="number"
          inputMode="decimal"
          min={0}
          step="any"
          value={downPayment}
          onChange={(event) => setDownPayment(event.target.value)}
          error={fieldErrors.downPayment}
          placeholder="e.g. 500"
        />

        {formError ? (
          <p className={styles.formError} role="alert">
            {formError}
          </p>
        ) : null}

        <Button type="submit" fullWidth showChevron disabled={submitting}>
          {submitting ? "Getting pre-qualification…" : "Get pre-qualification"}
        </Button>
      </form>
    </Card>
  );
}
