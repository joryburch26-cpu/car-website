"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

// The sign-up page now comes first and has the log in form inside it
export default function LoginRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/signup");
  }, [router]);

  return null;
}
