import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import { AppLayout } from "@/containers/App/App";
import { getSessionUser } from "@/lib/auth";
import "./globals.scss";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
});

export const metadata: Metadata = {
  title: "GreenQuote",
  description: "Solar financing pre-qualification",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getSessionUser();

  return (
    <html lang="en">
      <body className={manrope.variable}>
        <AppLayout user={user}>{children}</AppLayout>
      </body>
    </html>
  );
}
