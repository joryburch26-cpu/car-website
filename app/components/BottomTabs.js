"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSeller } from "../lib/useSeller";
import { useLanguage } from "../context/LanguageContext";
import { siteText } from "../data/siteText";

// The bar at the bottom of the screen (like Instagram or TikTok).
// Only signed-in sellers see it.
export default function BottomTabs() {
  const pathname = usePathname();
  const { lang } = useLanguage();
  const x = siteText[lang];
  const { checked, isSeller } = useSeller(pathname);

  if (!checked || !isSeller || pathname.startsWith("/admin")) return null;

  const tabs = [
    {
      href: "/",
      label: x.tabHome,
      active: pathname === "/",
      icon: "M3 10.5 12 3l9 7.5V21a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z",
    },
    {
      href: "/profile",
      label: x.tabProfile,
      active: pathname === "/profile",
      icon: "M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10zm0 2c-4.4 0-8 2.2-8 5v2h16v-2c0-2.8-3.6-5-8-5z",
    },
  ];

  return (
    <>
      {/* Space so that the bar does not cover the end of the page */}
      <div className="h-16" />

      <nav
        className="fixed bottom-0 inset-x-0 z-40 bg-white border-t border-[#81b7db] flex"
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      >
        {tabs.map((tab) => (
          <Link
            key={tab.href}
            href={tab.href}
            className={
              "flex-1 flex flex-col items-center justify-center gap-1 py-2 text-xs transition " +
              (tab.active ? "text-[#0171bb] font-semibold" : "text-brand-muted")
            }
          >
            <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor" aria-hidden="true">
              <path d={tab.icon} />
            </svg>
            {tab.label}
          </Link>
        ))}
      </nav>
    </>
  );
}
