import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from "react";
import styles from "./Input.module.scss";

type SharedProps = {
  label: string;
  error?: string;
  hint?: string;
  id: string;
  className?: string;
};

export type TextInputProps = SharedProps &
  Omit<InputHTMLAttributes<HTMLInputElement>, "id" | "className"> & {
    as?: "input";
  };

export type SelectInputProps = SharedProps &
  Omit<SelectHTMLAttributes<HTMLSelectElement>, "id" | "className"> & {
    as: "select";
    children: ReactNode;
  };

export type InputProps = TextInputProps | SelectInputProps;

export function Input(props: InputProps) {
  const describedBy = props.error
    ? `${props.id}-error`
    : props.hint
      ? `${props.id}-hint`
      : undefined;

  const fieldClass = [styles.field, props.className ?? ""].filter(Boolean).join(" ");

  if (props.as === "select") {
    const { label, error, hint, id, children, ...rest } = props;

    return (
      <div className={fieldClass}>
        <label className={styles.label} htmlFor={id}>
          {label}
        </label>
        <select
          id={id}
          className={[styles.control, styles.select, error ? styles.invalid : ""]
            .filter(Boolean)
            .join(" ")}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          {...withoutKeys(rest, ["as", "className"])}
        >
          {children}
        </select>
        <FieldMessage id={id} error={error} hint={hint} />
      </div>
    );
  }

  const { label, error, hint, id, ...rest } = props;

  return (
    <div className={fieldClass}>
      <label className={styles.label} htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        className={[styles.control, error ? styles.invalid : ""]
          .filter(Boolean)
          .join(" ")}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy}
        {...withoutKeys(rest, ["as", "className"])}
      />
      <FieldMessage id={id} error={error} hint={hint} />
    </div>
  );
}

function FieldMessage({
  id,
  error,
  hint,
}: {
  id: string;
  error?: string;
  hint?: string;
}) {
  if (error) {
    return (
      <p id={`${id}-error`} className={styles.error} role="alert">
        {error}
      </p>
    );
  }
  if (hint) {
    return (
      <p id={`${id}-hint`} className={styles.hint}>
        {hint}
      </p>
    );
  }
  return null;
}

function withoutKeys<T extends object>(
  value: T,
  keys: string[],
): Omit<T, never> {
  const clone = { ...value } as Record<string, unknown>;
  for (const key of keys) {
    delete clone[key];
  }
  return clone as Omit<T, never>;
}
