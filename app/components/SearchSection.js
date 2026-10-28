"use client";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useLanguage } from "../context/LanguageContext";
import { siteText } from "../data/siteText";
import carBrands from "../data/carBrands";
import egyptAreas from "../data/egyptAreas";
import SearchSelect from "./SearchSelect";
import SellerCard from "./SellerCard";

const otherArea = "أخرى";

export default function SearchSection() {
  const { lang } = useLanguage();
  const x = siteText[lang];

  const [country, setCountry] = useState("");
  const [brand, setBrand] = useState("");
  const [governorate, setGovernorate] = useState("");
  const [area, setArea] = useState("");
  const [product, setProduct] = useState("");

  const [results, setResults] = useState([]);
  const [status, setStatus] = useState("idle"); // idle, loading, done, error

  const hasFilter = country || brand || governorate || area || product.trim();

  // Search automatically a moment after the visitor changes any bar
  useEffect(() => {
    if (!hasFilter) {
      setResults([]);
      setStatus("idle");
      return;
    }

    setStatus("loading");
    let cancelled = false;

    const timer = setTimeout(async () => {
      let query = supabase
        .from("seller_profiles")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(30);

      if (country) query = query.contains("car_countries", [country]);
      if (brand) query = query.contains("car_brands", [brand]);
      if (governorate) query = query.eq("governorate", governorate);
      if (area) query = query.eq("area", area);
      if (product.trim()) {
        const text = product.trim().replace(/[%_,()]/g, " ");
        query = query.ilike("parts", "%" + text + "%");
      }

      const { data, error } = await query;
      if (cancelled) return;

      if (error) {
        setResults([]);
        setStatus("error");
        return;
      }

      setResults(data || []);
      setStatus("done");
    }, 350);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [country, brand, governorate, area, product, hasFilter]);

  // Options for each bar
  const countryOptions = carBrands.map((c) => ({
    value: c.key,
    label: lang === "ar" ? c.ar : c.key,
    search: c.key + " " + c.ar,
  }));

  const chosenCountry = carBrands.find((c) => c.key === country);
  const brandList = chosenCountry
    ? chosenCountry.brands
    : Array.from(new Set(carBrands.flatMap((c) => c.brands))).sort((a, b) => a.localeCompare(b));
  const brandOptions = brandList.map((b) => ({ value: b, label: b }));

  const governorateOptions = egyptAreas.map((g) => ({
    value: g.key,
    label: lang === "ar" ? g.ar : g.key,
    search: g.key + " " + g.ar,
  }));

  const chosenGovernorate = egyptAreas.find((g) => g.key === governorate);
  const areaList = chosenGovernorate
    ? chosenGovernorate.areas
    : Array.from(new Set(egyptAreas.flatMap((g) => g.areas)));
  const areaOptions = [...areaList, otherArea].map((a) => ({ value: a, label: a }));

  function changeCountry(value) {
    setCountry(value);
    const next = carBrands.find((c) => c.key === value);
    if (brand && next && !next.brands.includes(brand)) setBrand("");
  }

  function changeGovernorate(value) {
    setGovernorate(value);
    const next = egyptAreas.find((g) => g.key === value);
    if (area && next && area !== otherArea && !next.areas.includes(area)) setArea("");
  }

  function clearAll() {
    setCountry("");
    setBrand("");
    setGovernorate("");
    setArea("");
    setProduct("");
  }

  return (
    <div id="search" className="scroll-mt-4 min-h-[200px] mt-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <SearchSelect
          placeholder={x.searchCountry}
          options={countryOptions}
          value={country}
          onChange={changeCountry}
          emptyText={x.noOptions}
        />
        <SearchSelect
          placeholder={x.searchBrand}
          options={brandOptions}
          value={brand}
          onChange={setBrand}
          emptyText={x.noOptions}
        />
        <SearchSelect
          placeholder={x.searchGovernorate}
          options={governorateOptions}
          value={governorate}
          onChange={changeGovernorate}
          emptyText={x.noOptions}
        />
        <SearchSelect
          placeholder={x.searchArea}
          options={areaOptions}
          value={area}
          onChange={setArea}
          emptyText={x.noOptions}
        />
        <input
          type="text"
          value={product}
          onChange={(e) => setProduct(e.target.value)}
          placeholder={x.searchProduct}
          maxLength={100}
          className="sm:col-span-2 w-full bg-white border border-[#81b7db] rounded-full px-5 py-2 text-base text-brand-text outline-none focus:border-[#0171bb] placeholder:text-[#6aaed8]"
        />
      </div>

      {hasFilter && (
        <div className="mt-3 text-end">
          <button
            type="button"
            onClick={clearAll}
            className="text-sm text-brand-muted hover:text-[#0171bb]"
          >
            {x.clearSearch}
          </button>
        </div>
      )}

      <div className="mt-6 flex flex-col gap-4">
        {status === "idle" && <p className="text-center text-brand-muted">{x.chooseToSearch}</p>}
        {status === "loading" && <p className="text-center text-brand-muted">{x.searching}</p>}
        {status === "error" && <p className="text-center text-red-600">{x.searchError}</p>}
        {status === "done" && results.length === 0 && (
          <p className="text-center text-brand-muted">{x.noResults}</p>
        )}
        {status === "done" && results.length > 0 && (
          <>
            <h2 className="text-xl font-bold text-[#0171bb]">{x.resultsTitle}</h2>
            {results.map((seller) => (
              <SellerCard key={seller.public_id} seller={seller} />
            ))}
          </>
        )}
      </div>
    </div>
  );
}
