"use client";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import { useLanguage } from "../context/LanguageContext";
import { siteText } from "../data/siteText";

export default function AboutPage() {
  const { lang } = useLanguage();
  const x = siteText[lang];

  return (
    <div className="min-h-screen bg-white text-zinc-800 flex flex-col">
      <SiteHeader />
      <main className="flex-1 w-full max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-[#0171BB] mb-4">{x.aboutTitle}</h1>
        <p className="text-lg leading-8">{x.aboutText}</p>
      </main>
      <SiteFooter />
    </div>
  );
}
