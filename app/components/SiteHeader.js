"use client";
import Link from "next/link";
import { supabase } from "../lib/supabaseClient";
import { useSeller } from "../lib/useSeller";
import { useLanguage } from "../context/LanguageContext";
import { siteText } from "../data/siteText";

export default function SiteHeader() {
  const { lang, toggleLanguage } = useLanguage();
  const x = siteText[lang];
  const { checked, isLoggedIn, isSeller } = useSeller();

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  const linkClass = "text-white hover:underline underline-offset-4 transition";

  return (
    <header className="w-full bg-white">
      {/* Logo and the empty banner space */}
      <div className="max-w-6xl mx-auto px-4 pt-6 pb-4 flex items-center gap-4">
        <Link href="/" className="shrink-0">
          <img src="/logo.png" alt={x.logoAlt} className="h-20 sm:h-28 w-auto" />
        </Link>
        <div className="flex-1 h-20 sm:h-28 rounded-2xl bg-[#E4F1F9]" aria-hidden="true" />
      </div>

      {/* Blue menu bar */}
      <nav className="bg-[#81B7DB]">
        <div className="max-w-6xl mx-auto px-4 py-2 flex flex-wrap items-center gap-x-8 gap-y-1 text-base">
          <Link href="/" className={linkClass}>{x.navHome}</Link>
          <Link href="/about" className={linkClass}>{x.navAbout}</Link>
          <Link href="/idea" className={linkClass}>{x.navIdea}</Link>

          {checked && !isLoggedIn && (
            <>
              <Link href="/signup" className={linkClass}>{x.navCreateAccount}</Link>
              <a href="/signup#login" className={linkClass}>{x.navLogin}</a>
            </>
          )}

          {checked && isLoggedIn && isSeller && (
            <Link href="/seller/dashboard" className={linkClass}>{x.navProfile}</Link>
          )}

          {checked && isLoggedIn && (
            <button onClick={handleLogout} className={linkClass}>{x.navLogout}</button>
          )}

          <button
            onClick={toggleLanguage}
            className="ms-auto text-white border border-white/70 rounded-full px-4 py-1 text-sm hover:bg-white/20 transition"
          >
            {x.otherLanguage}
          </button>
        </div>
      </nav>
    </header>
  );
}
