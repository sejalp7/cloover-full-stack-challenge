import type { Metadata } from "next";
import { ApiDocs } from "@/containers/ApiDocs/ApiDocs";

export const metadata: Metadata = {
  title: "API docs · GreenQuote",
  description: "OpenAPI reference for the GreenQuote API",
};

export default function ApiDocsPage() {
  return <ApiDocs />;
}
