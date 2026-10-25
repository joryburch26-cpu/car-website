"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import siteConfig from "../data/siteConfig";
import { useLanguage } from "../context/LanguageContext";
import { supabase } from "../lib/supabaseClient";

export default function Navbar() {
  const { lang, toggleLanguage, t } = useLanguage();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    checkSeller();
  }, []);

  async function checkSeller() {
    const { data: { user } } = await supabase.auth.getUser();
    setIsLoggedIn(!!user);
    setChecked(true);
  }

  return (
    <nav className="w-full flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-3 sm:py-4 bg-brand-bg text-brand-text border-b border-zinc-800">
      <span className="text-xl font-bold">{siteConfig.name}</span>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 sm:gap-6 text-sm text-brand-muted">
        <a href="/" className="hover:text-brand-text transition">{t.home}</a>
        <a href="/#how-it-works" className="hover:text-brand-text transition">{t.howItWorks}</a>
        <a href="/#faq" className="hover:text-brand-text transition">{t.faq}</a>
        <a href="/#contact" className="hover:text-brand-text transition">{t.contact}</a>

        {checked && (
          <Link
            href={isLoggedIn ? "/seller/dashboard" : "/seller/login"}
            className="bg-brand-accent text-black font-semibold px-4 py-2 rounded-full hover:bg-zinc-200 transition"
          >
            {isLoggedIn ? t.myDashboard : t.signIn}
          </Link>
        )}

        <button
          onClick={toggleLanguage}
          className="border border-zinc-600 rounded-full px-3 py-1 hover:border-white transition text-xs"
        >
          {lang === "en" ? "العربية" : "English"}
        </button>
      </div>
    </nav>
  );
}