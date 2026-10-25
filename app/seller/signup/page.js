"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Old address: send everyone to the new shared sign-up page
export default function SellerSignupRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/signup");
  }, [router]);

  return null;
}
