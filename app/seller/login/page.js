"use client";
import { useEffect } from "react";

// Old address: open the log in form on the sign-up page
export default function SellerLoginRedirect() {
  useEffect(() => {
    window.location.replace("/signup#login");
  }, []);

  return null;
}
