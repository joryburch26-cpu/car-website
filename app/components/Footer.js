"use client";
import Link from "next/link";
import siteConfig from "../data/siteConfig";
import { useLanguage } from "../context/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer id="contact" className="bg-brand-bg-dark text-brand-muted px-6 py-12">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between gap-8">
        <div>
          <h3 className="text-brand-text font-bold text-lg mb-2">{siteConfig.name}</h3>
          <p className="text-sm">{t.footerTagline}</p>
        </div>
        <div className="flex flex-col gap-2 text-sm">
          <a href="/" className="hover:text-brand-text transition">{t.home}</a>
          <a href="/signup" className="hover:text-brand-text transition">{t.sellYourCar}</a>
          <a href="/#how-it-works" className="hover:text-brand-text transition">{t.howItWorks}</a>
          <a href="/#faq" className="hover:text-brand-text transition">{t.faq}</a>
        </div>
        <div className="flex flex-col gap-2 text-sm">
          <p>{t.footerEmail}</p>
          <p>{t.footerPhone}</p>
        </div>
      </div>
      <p className="text-center text-xs mt-10 text-zinc-600">
        © 2026 {siteConfig.name}. {t.footerRights}
      </p>
      <p className="text-center text-xs mt-2">
        <Link href="/admin/login" className="text-zinc-700 hover:text-zinc-500 transition">
          Admin
        </Link>
      </p>
    </footer>
  );
}