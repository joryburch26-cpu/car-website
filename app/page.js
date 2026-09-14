"use client";
import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import HowItWorks from "./components/HowItWorks";
import FAQ from "./components/FAQ";
import Footer from "./components/Footer";
import siteConfig from "./data/siteConfig";
import governorates from "./data/governorates";
import { supabase } from "./lib/supabaseClient";
import { useLanguage } from "./context/LanguageContext";

export default function Home() {
  const { t } = useLanguage();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  const [partSearch, setPartSearch] = useState("");
  const [brandSearch, setBrandSearch] = useState("");
  const [modelSearch, setModelSearch] = useState("");
  const [yearSearch, setYearSearch] = useState("");
  const [governorateSearch, setGovernorateSearch] = useState("");

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    setLoading(true);
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) {
      setProducts(data);
    }
    setLoading(false);
  }

  const filteredParts = products.filter((part) => {
    if (partSearch && !part.part_name?.toLowerCase().includes(partSearch.toLowerCase())) return false;
    if (brandSearch && !part.brand?.toLowerCase().includes(brandSearch.toLowerCase())) return false;
    if (modelSearch && !part.model?.toLowerCase().includes(modelSearch.toLowerCase())) return false;
    if (yearSearch && String(part.year) !== String(yearSearch)) return false;
    if (governorateSearch && part.city !== governorateSearch) return false;
    return true;
  });

  return (
    <>
      <Navbar />

      <section className="bg-brand-card px-6 py-4">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            placeholder={t.searchParts}
            value={partSearch}
            onChange={(e) => setPartSearch(e.target.value)}
            className="bg-brand-bg border border-zinc-700 rounded-lg px-4 py-2 outline-none focus:border-white flex-1"
          />

          <input
            type="text"
            placeholder={t.selectBrand}
            value={brandSearch}
            onChange={(e) => setBrandSearch(e.target.value)}
            className="bg-brand-bg border border-zinc-700 rounded-lg px-4 py-2 outline-none focus:border-white flex-1"
          />

          <input
            type="text"
            placeholder={t.selectModel}
            value={modelSearch}
            onChange={(e) => setModelSearch(e.target.value)}
            className="bg-brand-bg border border-zinc-700 rounded-lg px-4 py-2 outline-none focus:border-white flex-1"
          />

          <input
            type="number"
            placeholder={t.searchYear}
            value={yearSearch}
            onChange={(e) => setYearSearch(e.target.value)}
            className="bg-brand-bg border border-zinc-700 rounded-lg px-4 py-2 outline-none focus:border-white flex-1"
          />

          <select
            value={governorateSearch}
            onChange={(e) => setGovernorateSearch(e.target.value)}
            className="bg-brand-bg border border-zinc-700 rounded-lg px-4 py-2 outline-none focus:border-white flex-1"
          >
            <option value="">{t.allGovernorates}</option>
            {governorates.map((gov) => (
              <option key={gov} value={gov}>{gov}</option>
            ))}
          </select>
        </div>
      </section>

      <main className="flex flex-col items-center justify-center bg-brand-bg text-brand-text px-6 py-20">
        <h1 className="text-4xl md:text-6xl font-bold text-center">
          {siteConfig.name}
        </h1>
      </main>

      <section className="bg-brand-bg text-brand-text px-6 pb-20">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
          {t.browseCarsForSale}
        </h2>

        {loading ? (
          <p className="text-center text-brand-muted">{t.loadingCars}</p>
        ) : (
          <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredParts.map((part) => (
              <button
                key={part.id}
                onClick={() => setSelected(part)}
                className="bg-brand-card rounded-2xl overflow-hidden text-left hover:opacity-90 transition"
              >
                {part.photo_urls && (
                  <img
                    src={part.photo_urls.split(", ")[0]}
                    alt={part.part_name}
                    className="w-full h-40 object-cover"
                  />
                )}
                <div className="p-4">
                  <h3 className="font-semibold text-lg">{part.part_name}</h3>
                  <p className="text-brand-muted text-sm mb-2">
                    {part.brand || part.model || part.year
                      ? `${part.brand || ""} ${part.model || ""} ${part.year || ""}`
                      : t.fitsAnyCar}
                  </p>
                  <p className="text-lg font-bold">
                    {Number(part.price).toLocaleString()} EGP
                  </p>
                  <p className="text-brand-muted text-xs mt-1">{part.city}</p>
                </div>
              </button>
            ))}
          </div>
        )}

        {!loading && filteredParts.length === 0 && (
          <p className="text-center text-zinc-500 mt-10">{t.noCarsMatch}</p>
        )}
      </section>

      <HowItWorks />
      <FAQ />
      <Footer />

      {selected && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center px-6 z-50">
          <div className="bg-brand-card rounded-2xl p-8 max-w-lg w-full max-h-[85vh] overflow-y-auto">
            {selected.photo_urls && (
              <div className="grid grid-cols-3 gap-2 mb-4">
                {selected.photo_urls.split(", ").map((url, i) => (
                  <img
                    key={i}
                    src={url}
                    alt={selected.part_name}
                    className="w-full h-24 object-cover rounded-lg"
                  />
                ))}
              </div>
            )}

            <h2 className="text-xl font-bold mb-4">{selected.part_name}</h2>

            <div className="text-sm text-brand-muted flex flex-col gap-2 mb-6">
              {selected.brand || selected.model || selected.year ? (
                <>
                  <p><span className="text-zinc-500">{t.selectBrand}:</span> {selected.brand}</p>
                  <p><span className="text-zinc-500">{t.selectModel}:</span> {selected.model}</p>
                  <p><span className="text-zinc-500">{t.searchYear}:</span> {selected.year}</p>
                </>
              ) : (
                <p><span className="text-zinc-500">{t.selectBrand}:</span> {t.fitsAnyCar}</p>
              )}
              <p><span className="text-zinc-500">{t.priceEgp}:</span> {Number(selected.price).toLocaleString()} EGP</p>
              <p><span className="text-zinc-500">{t.phoneNumber}:</span> {selected.phone}</p>
              <p><span className="text-zinc-500">{t.city}:</span> {selected.city}</p>
              <p><span className="text-zinc-500">{t.shopAddress}:</span> {selected.address}</p>
            </div>

            <button
              onClick={() => setSelected(null)}
              className="px-4 py-2 rounded-full border border-zinc-600 hover:border-white transition text-sm w-full"
            >
              {t.backToHome}
            </button>
          </div>
        </div>
      )}
    </>
  );
}