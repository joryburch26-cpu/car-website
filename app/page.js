"use client";
import SiteHeader from "./components/SiteHeader";
import SiteFooter from "./components/SiteFooter";
import SearchSection from "./components/SearchSection";
import { useSeller } from "./lib/useSeller";
import { useLanguage } from "./context/LanguageContext";
import { siteText } from "./data/siteText";

export default function Home() {
  const { lang } = useLanguage();
  const x = siteText[lang];
  const other = siteText[lang === "ar" ? "en" : "ar"];
  const { checked, isSeller } = useSeller();

  const titleClass = "block text-2xl md:text-3xl font-bold text-[#0171BB]";
  const subtitleClass = "block text-lg md:text-xl text-[#6AAED8]";

  return (
    <div className="min-h-screen bg-white text-zinc-800 flex flex-col">
      <SiteHeader />

      <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-[15%_1fr_15%] gap-4 md:min-h-[540px]">
          {/* Empty side space (left or right depending on the language) */}
          <aside className="hidden md:block bg-[#E4F1F9]" aria-hidden="true" />

          <section>
            <div className="flex items-start justify-around gap-4 mb-6">
              <a href="#search" className="text-center">
                <span className={titleClass}>{x.searchTitle}</span>
                <span className={subtitleClass}>{other.searchTitle}</span>
              </a>

              {/* Only sellers who are signed in see this link */}
              {checked && isSeller && (
                <a href="/profile" className="text-center">
                  <span className={titleClass}>{x.addInfoTitle}</span>
                  <span className={subtitleClass}>{other.addInfoTitle}</span>
                </a>
              )}
            </div>

            <img src="/car-parts.jpg" alt={x.carAlt} className="w-full h-auto" />

            {/* The search bars and the sellers who match */}
            <SearchSection />
          </section>

          <aside className="hidden md:block bg-[#E4F1F9]" aria-hidden="true" />
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
