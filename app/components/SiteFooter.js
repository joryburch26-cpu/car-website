"use client";
import { useState } from "react";
import Link from "next/link";
import { supabase } from "../lib/supabaseClient";
import { useSeller } from "../lib/useSeller";
import { useLanguage } from "../context/LanguageContext";
import { siteText } from "../data/siteText";
import socialLinks from "../data/socialLinks";

const icons = [
  {
    key: "facebook",
    color: "#3b5998",
    label: "Facebook",
    path: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z",
  },
  {
    key: "x",
    color: "#1da1f2",
    label: "X",
    path: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z",
  },
  {
    key: "instagram",
    color: "#d6249f",
    label: "Instagram",
    path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z",
  },
  {
    key: "linkedin",
    color: "#0a66c2",
    label: "LinkedIn",
    path: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
  },
];

export default function SiteFooter() {
  const { lang } = useLanguage();
  const x = siteText[lang];
  const { checked, isLoggedIn } = useSeller();

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [status, setStatus] = useState("");

  async function handleSubscribe(e) {
    e.preventDefault();
    setStatus("sending");

    const { error } = await supabase.from("subscribers").insert({ email, name });

    if (error) {
      setStatus("error");
      return;
    }

    setEmail("");
    setName("");
    setStatus("done");
  }

  const fieldClass =
    "w-full bg-white text-zinc-700 text-sm px-2 py-1 outline-none placeholder:text-[#6AAED8]";

  return (
    <footer className="bg-[#80B8DD] text-white mt-10">
      <div className="max-w-6xl mx-auto px-6 py-8 grid gap-8 md:grid-cols-3 items-start">
        <img src="/logo-white.png" alt={x.logoAlt} className="h-24 w-auto" />

        <form onSubmit={handleSubscribe} className="flex flex-col gap-2 max-w-xs">
          <div className="grid grid-cols-[5rem_1fr] gap-x-3 gap-y-2 items-center text-sm">
            <label htmlFor="footer-email">{x.subscribe}</label>
            <input
              id="footer-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={x.yourEmail}
              maxLength={200}
              className={fieldClass}
              required
            />
            <label htmlFor="footer-name">{x.nameLabel}</label>
            <input
              id="footer-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={x.yourName}
              maxLength={100}
              className={fieldClass}
            />
          </div>

          <button
            type="submit"
            disabled={status === "sending"}
            className="self-start mt-1 bg-white text-[#0171BB] text-sm font-semibold px-4 py-1 rounded-full hover:bg-[#E4F1F9] transition disabled:opacity-60"
          >
            {status === "sending" ? x.sending : x.send}
          </button>

          {status === "done" && <p className="text-sm">{x.thanks}</p>}
          {status === "error" && <p className="text-sm">{x.subscribeError}</p>}
        </form>

        <div className="flex gap-3 md:justify-end">
          {icons.map((icon) => {
            const link = socialLinks[icon.key];
            const circle = (
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill={icon.color} aria-hidden="true">
                <path d={icon.path} />
              </svg>
            );
            const circleClass =
              "w-11 h-11 rounded-full bg-white shadow-md flex items-center justify-center";

            return link ? (
              <a
                key={icon.key}
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={icon.label}
                className={circleClass + " hover:scale-105 transition"}
              >
                {circle}
              </a>
            ) : (
              <span key={icon.key} className={circleClass}>
                {circle}
              </span>
            );
          })}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 pb-4 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-20 text-sm">
        <span>www.elwekalla.com</span>
        <a href="mailto:info@elwekalla.com" className="hover:underline">info@elwekalla.com</a>
      </div>

      {checked && !isLoggedIn && (
        <div className="text-center pb-6">
          <Link
            href="/signup"
            className="inline-block bg-white text-[#0171BB] text-sm font-semibold px-5 py-2 rounded-full hover:bg-[#E4F1F9] transition"
          >
            {x.createSellerAccount}
          </Link>
        </div>
      )}
    </footer>
  );
}
