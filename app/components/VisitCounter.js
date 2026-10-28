"use client";
import { useEffect } from "react";
import { supabase } from "../lib/supabaseClient";

// Stops a double count if React runs the effect twice on the same page load
let alreadyAsked = false;

// Adds 1 to today's visitor number. Nothing about the visitor is stored:
// no name, no email, no IP address, no ID. The browser only remembers
// today's date, so that a refresh is not counted again on the same day.
export default function VisitCounter() {
  useEffect(() => {
    // Visits to the admin pages are not counted
    if (window.location.pathname.startsWith("/admin")) return;

    if (alreadyAsked) return;
    alreadyAsked = true;

    const today = new Date().toLocaleDateString("en-CA", { timeZone: "Africa/Cairo" });

    // Find a place in the browser to remember today's date
    let storage = null;
    try {
      window.localStorage.setItem("counted_test", "1");
      window.localStorage.removeItem("counted_test");
      storage = window.localStorage;
    } catch (e) {
      try {
        window.sessionStorage.setItem("counted_test", "1");
        window.sessionStorage.removeItem("counted_test");
        storage = window.sessionStorage;
      } catch (e2) {
        storage = null;
      }
    }

    // If the browser blocks all storage we cannot know if this visitor was
    // already counted. A number that is a little low is better than a number
    // that grows on every refresh, so we do not count this visit.
    if (!storage) return;

    if (storage.getItem("counted_day") === today) return;

    // Remember first, then count. If counting fails, forget again so that
    // the next visit tries again.
    storage.setItem("counted_day", today);
    supabase.rpc("record_visit").then(({ error }) => {
      if (error) storage.removeItem("counted_day");
    });
  }, []);

  return null;
}
