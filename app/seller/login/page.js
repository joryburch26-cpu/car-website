"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Old address: send everyone to the new shared login page
export default function SellerLoginRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/login");
  }, [router]);

  return null;
}
