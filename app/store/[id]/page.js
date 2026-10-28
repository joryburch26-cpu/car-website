"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import SiteHeader from "../../components/SiteHeader";
import SiteFooter from "../../components/SiteFooter";
import { supabase } from "../../lib/supabaseClient";
import { useLanguage } from "../../context/LanguageContext";
import { siteText } from "../../data/siteText";
import egyptAreas from "../../data/egyptAreas";
import carBrands from "../../data/carBrands";
import { callLink, whatsappLink } from "../../lib/phone";

// The public page of one seller (what buyers see)
export default function StorePage() {
  const params = useParams();
  const id = params.id;
  const { lang } = useLanguage();
  const x = siteText[lang];

  const [loading, setLoading] = useState(true);
  const [seller, setSeller] = useState(null);
  const [stock, setStock] = useState([]);

  useEffect(() => {
    async function load() {
      const { data: sellerRow } = await supabase
        .from("seller_profiles")
        .select("*")
        .eq("public_id", id)
        .maybeSingle();

      setSeller(sellerRow);

      if (sellerRow) {
        const { data: stockRows } = await supabase
          .from("seller_stock")
          .select("id, url")
          .eq("seller_public_id", id)
          .order("created_at", { ascending: false });
        setStock(stockRows || []);
      }

      setLoading(false);
    }

    load();
  }, [id]);

  const shell = (content) => (
    <div className="min-h-screen bg-brand-bg text-brand-text flex flex-col">
      <SiteHeader />
      {content}
      <SiteFooter />
    </div>
  );

  if (loading) {
    return shell(<p className="flex-1 text-center text-brand-muted py-20">{x.loadingText}</p>);
  }

  if (!seller) {
    return shell(
      <div className="flex-1 text-center py-20">
        <p className="text-brand-muted mb-4">{x.storeNotFound}</p>
        <Link href="/" className="text-[#0171bb] hover:underline">{x.backToSearch}</Link>
      </div>
    );
  }

  const governorate = egyptAreas.find((g) => g.key === seller.governorate);
  const governorateName = governorate ? (lang === "ar" ? governorate.ar : governorate.key) : "";
  const countries = (seller.car_countries || []).map((key) => {
    const c = carBrands.find((item) => item.key === key);
    return c ? (lang === "ar" ? c.ar : c.key) : key;
  });
  const brands = seller.car_brands || [];
  const initial = (seller.name || "?").trim().charAt(0).toUpperCase();
  const call = callLink(seller.phone);
  const chat = whatsappLink(seller.phone);

  const row = (label, value) =>
    value ? (
      <div>
        <p className="text-sm text-brand-muted">{label}</p>
        <p className="text-brand-text">{value}</p>
      </div>
    ) : null;

  return shell(
    <main className="flex-1 w-full max-w-3xl mx-auto px-4 py-8 flex flex-col gap-8">
      <section className="flex items-center gap-5">
        {seller.avatar_url ? (
          <img
            src={seller.avatar_url}
            alt=""
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-2 border-[#81b7db]"
          />
        ) : (
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-[#e4f1f9] border-2 border-[#81b7db] flex items-center justify-center text-4xl font-bold text-[#0171bb]">
            {initial}
          </div>
        )}

        <div className="flex-1">
          <h1 className="text-2xl font-bold">{seller.name}</h1>
          {seller.shop_name && <p className="text-brand-muted">{seller.shop_name}</p>}
          <div className="flex flex-wrap gap-2 mt-3">
            {call && (
              <a href={call} className="text-sm font-semibold px-4 py-1 rounded-full bg-[#0171bb] text-white hover:bg-[#015a96] transition">
                {x.callSeller}
              </a>
            )}
            {chat && (
              <a
                href={chat}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-semibold px-4 py-1 rounded-full bg-white text-[#0171bb] border border-[#0171bb] hover:bg-[#e4f1f9] transition"
              >
                {x.whatsapp}
              </a>
            )}
          </div>
        </div>
      </section>

      <section className="bg-brand-card rounded-2xl p-6 grid gap-4 sm:grid-cols-2">
        {row(x.fieldPhone, seller.phone)}
        {row(x.fieldContactEmail, seller.email)}
        {row(x.fieldGovernorate, governorateName)}
        {row(x.fieldArea, seller.area)}
        <div className="sm:col-span-2">{row(x.fieldAddress, seller.address)}</div>
        <div className="sm:col-span-2">{row(x.fieldParts, seller.parts)}</div>

        {(countries.length > 0 || brands.length > 0) && (
          <div className="sm:col-span-2">
            <p className="text-sm text-brand-muted mb-2">{x.carsIWorkOn}</p>
            <div className="flex flex-wrap gap-2 mb-2">
              {countries.map((c) => (
                <span key={c} className="px-3 py-1 rounded-full text-sm bg-[#0171bb] text-white">{c}</span>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {brands.map((b) => (
                <span key={b} className="px-3 py-1 rounded-full text-sm bg-white border border-[#81b7db]">{b}</span>
              ))}
            </div>
          </div>
        )}
      </section>

      {stock.length > 0 && (
        <section>
          <h2 className="text-xl font-bold mb-3">{x.storeStock}</h2>
          <div className="grid grid-cols-3 gap-2">
            {stock.map((photo) => (
              <a key={photo.id} href={photo.url} target="_blank" rel="noopener noreferrer" className="aspect-square">
                <img src={photo.url} alt="" className="w-full h-full object-cover rounded-lg" />
              </a>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
