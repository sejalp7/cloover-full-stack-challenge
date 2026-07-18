"use client";

import dynamic from "next/dynamic";
import "swagger-ui-react/swagger-ui.css";
import styles from "./ApiDocs.module.scss";

const SwaggerUI = dynamic(() => import("swagger-ui-react"), {
  ssr: false,
  loading: () => <p className={styles.loading}>Loading API docs…</p>,
});

export function ApiDocs() {
  return (
    <div className={styles.wrap}>
      <SwaggerUI url="/openapi.yaml" docExpansion="list" defaultModelsExpandDepth={1} />
    </div>
  );
}
