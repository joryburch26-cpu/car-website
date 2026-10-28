"use client";
import Link from "next/link";
import { useLanguage } from "../context/LanguageContext";
import { siteText } from "../data/siteText";
import egyptAreas from "../data/egyptAreas";
import { callLink, whatsappLink } from "../lib/phone";

// One seller as a rectangle. The picture is on the right in Arabic and on the left in English.
export default function SellerCard({ seller }) {
  const { lang } = useLanguage();
  const x = siteText[lang];

  const governorate = egyptAreas.find((g) => g.key === seller.governorate);
  const governorateName = governorate ? (lang === "ar" ? governorate.ar : governorate.key) : "";
  const brands = seller.car_brands || [];
  const shownBrands = brands.slice(0, 5);
  const initial = (seller.name || "?").trim().charAt(0).toUpperCase();
  const call = callLink(seller.phone);
  const chat = whatsappLink(seller.phone);

  const buttonClass =
    "text-sm font-semibold px-4 py-1 rounded-full transition";

  return (
    <div className="flex gap-4 items-start bg-[#e4f1f9] rounded-2xl p-4">
      {seller.avatar_url ? (
        <img
          src={seller.avatar_url}
          alt=""
          className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-2 border-[#81b7db] shrink-0"
        />
      ) : (
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white border-2 border-[#81b7db] flex items-center justify-center text-3xl font-bold text-[#0171bb] shrink-0">
          {initial}
        </div>
      )}

      <div className="flex-1 min-w-0">
        <h3 className="text-lg font-bold text-brand-text">{seller.name}</h3>
        {seller.shop_name && <p className="text-brand-muted">{seller.shop_name}</p>}

        <p className="text-sm text-brand-text mt-1">
          {[governorateName, seller.area].filter(Boolean).join(" - ")}
        </p>
        {seller.address && <p className="text-sm text-brand-muted">{seller.address}</p>}

        {shownBrands.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {shownBrands.map((b) => (
              <span key={b} className="px-2 py-0.5 rounded-full text-xs bg-white border border-[#81b7db]">
                {b}
              </span>
            ))}
            {brands.length > shownBrands.length && (
              <span className="px-2 py-0.5 text-xs text-brand-muted">
                +{brands.length - shownBrands.length}
              </span>
            )}
          </div>
        )}

        <div className="flex flex-wrap gap-2 mt-3">
          {call && (
            <a href={call} className={buttonClass + " bg-[#0171bb] text-white hover:bg-[#015a96]"}>
              {x.callSeller}
            </a>
          )}
          {chat && (
            <a
              href={chat}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonClass + " bg-white text-[#0171bb] border border-[#0171bb] hover:bg-[#e4f1f9]"}
            >
              {x.whatsapp}
            </a>
          )}
          <Link
            href={"/store/" + seller.public_id}
            className={buttonClass + " text-brand-muted hover:text-[#0171bb]"}
          >
            {x.viewProfile}
          </Link>
        </div>
      </div>
    </div>
  );
}
