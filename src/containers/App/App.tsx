"use client";

import { useRouter } from "next/navigation";
import { Header } from "@/components/Header/Header";
import { apiClient } from "@/lib/api";
import type { SessionUser } from "@/types/user";

export type AppLayoutProps = {
  user: SessionUser | null;
  children: React.ReactNode;
};

export function AppLayout({ user, children }: AppLayoutProps) {
  const router = useRouter();

  async function handleLogout() {
    try {
      await apiClient.post("/auth/logout");
    } catch {
      // still clear the UI session via refresh
    }
    router.push("/");
    router.refresh();
  }

  return (
    <>
      <Header
        userName={user?.username ?? null}
        userRole={user?.role ?? null}
        onLogout={handleLogout}
      />
      <div className="appShell">{children}</div>
    </>
  );
}
