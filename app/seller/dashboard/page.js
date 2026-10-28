"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

// The old dashboard is now the profile page
export default function DashboardRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/profile");
  }, [router]);

  return null;
}
