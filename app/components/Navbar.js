"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import siteConfig from "../data/siteConfig";
import { useLanguage } from "../context/LanguageContext";
import { supabase } from "../lib/supabaseClient";

export default function Navbar() {
  const { lang, toggleLanguage, t } = useLanguage();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSeller, setIsSeller] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    checkUser();
  }, []);

  async function checkUser() {
    const { data: { user } } = await supabase.auth.getUser();
    setIsLoggedIn(!!user);

    if (user) {
      const { data: sellerRow } = await supabase
        .from("sellers")
        .select("user_id")
        .eq("user_id", user.id)
        .maybeSingle();
      setIsSeller(!!sellerRow);
    }

    setChecked(true);
  }

  async function handleBuyerLogout() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  return (
    <nav className="w-full flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-3 sm:py-4 bg-brand-bg text-brand-text border-b border-zinc-800">
      <span className="text-xl font-bold">{siteConfig.name}</span>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 sm:gap-6 text-sm text-brand-muted">
        <a href="/" className="hover:text-brand-text transition">{t.home}</a>
        <a href="/#how-it-works" className="hover:text-brand-text transition">{t.howItWorks}</a>
        <a href="/#faq" className="hover:text-brand-text transition">{t.faq}</a>
        <a href="/#contact" className="hover:text-brand-text transition">{t.contact}</a>

        {checked && isLoggedIn && isSeller && (
          <Link
            href="/seller/dashboard"
            className="bg-brand-accent text-black font-semibold px-4 py-2 rounded-full hover:bg-zinc-200 transition"
          >
            {t.myDashboard}
          </Link>
        )}

        {checked && isLoggedIn && !isSeller && (
          <button
            onClick={handleBuyerLogout}
            className="bg-brand-accent text-black font-semibold px-4 py-2 rounded-full hover:bg-zinc-200 transition"
          >
            {t.logOut}
          </button>
        )}

        {checked && !isLoggedIn && (
          <>
            <Link href="/login" className="hover:text-brand-text transition">
              {t.logIn}
            </Link>
            <Link
              href="/signup"
              className="bg-brand-accent text-black font-semibold px-4 py-2 rounded-full hover:bg-zinc-200 transition"
            >
              {t.signUp}
            </Link>
          </>
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