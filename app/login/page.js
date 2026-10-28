"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Old address: everyone starts on the home page
export default function LoginRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/");
  }, [router]);

  return null;
}
