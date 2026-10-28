"use client";
import { useEffect } from "react";
import { supabase } from "../lib/supabaseClient";

// Adds 1 to today's visitor number. Nothing about the visitor is stored:
// no name, no email, no IP address, no ID. The browser only remembers
// today's date, so that a refresh is not counted again on the same day.
//
// A visit is counted only when a real person stays on the page for 3 seconds
// with the tab in front. Quick refreshes, robots, link previews and pages that
// the browser loads in the background are not counted.

let started = false;

function findStorage(kind) {
  try {
    const storage = window[kind];
    storage.setItem("counted_test", "1");
    storage.removeItem("counted_test");
    return storage;
  } catch (e) {
    return null;
  }
}

export default function VisitCounter() {
  useEffect(() => {
    // Visits to the admin pages are not counted
    if (window.location.pathname.startsWith("/admin")) return;

    // Robots and automatic browsers are not counted
    const agent = navigator.userAgent || "";
    if (
      navigator.webdriver ||
      /bot|crawl|spider|headless|lighthouse|preview|facebookexternalhit|whatsapp|telegram/i.test(agent)
    ) {
      return;
    }

    const today = new Date().toLocaleDateString("en-CA", { timeZone: "Africa/Cairo" });
    const local = findStorage("localStorage");
    const session = findStorage("sessionStorage");

    // If the browser blocks all storage we cannot know if this visitor was
    // already counted. A number that is a little low is better than a number
    // that grows on every refresh, so we do not count this visit.
    if (!local && !session) return;

    function alreadyCounted() {
      return (
        (local && local.getItem("counted_day") === today) ||
        (session && session.getItem("counted_day") === today)
      );
    }

    if (alreadyCounted()) return;

    let timer = null;

    function count() {
      if (started || alreadyCounted()) return;

      // The tab must be in front. If not, wait until the visitor comes back to it.
      if (document.visibilityState !== "visible") return;

      started = true;
      if (local) local.setItem("counted_day", today);
      if (session) session.setItem("counted_day", today);

      let navType = "";
      try {
        const entry = performance.getEntriesByType("navigation")[0];
        navType = entry ? entry.type : "";
      } catch (e) {
        navType = "";
      }

      supabase.rpc("record_visit", { p_nav_type: navType }).then(({ error }) => {
        if (error) {
          // Counting failed, so allow the next visit to try again
          started = false;
          if (local) local.removeItem("counted_day");
          if (session) session.removeItem("counted_day");
        }
      });
    }

    function startTimer() {
      clearTimeout(timer);
      timer = setTimeout(count, 3000);
    }

    function handleVisibility() {
      if (document.visibilityState === "visible") startTimer();
      else clearTimeout(timer);
    }

    document.addEventListener("visibilitychange", handleVisibility);
    if (document.visibilityState === "visible") startTimer();

    return () => {
      clearTimeout(timer);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  return null;
}
