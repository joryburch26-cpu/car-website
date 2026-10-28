"use client";
import { useEffect } from "react";
import { supabase } from "../lib/supabaseClient";

// Adds 1 to today's visitor number. Nothing about the visitor is stored:
// no name, no email, no IP address, no ID. The browser only remembers
// today's date, so that a refresh is not counted twice on the same day.
export default function VisitCounter() {
  useEffect(() => {
    // Visits to the admin pages are not counted
    if (window.location.pathname.startsWith("/admin")) return;

    const today = new Date().toLocaleDateString("en-CA", { timeZone: "Africa/Cairo" });

    try {
      if (localStorage.getItem("counted_day") === today) return;
    } catch (e) {
      // If the browser blocks storage, the visit is simply counted
    }

    supabase.rpc("record_visit").then(({ error }) => {
      if (!error) {
        try {
          localStorage.setItem("counted_day", today);
        } catch (e) {
          // ignore
        }
      }
    });
  }, []);

  return null;
}
