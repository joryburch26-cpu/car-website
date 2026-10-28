"use client";
import carBrands from "../data/carBrands";
import egyptAreas from "../data/egyptAreas";
import { siteText } from "../data/siteText";
import { useLanguage } from "../context/LanguageContext";

const inputClass =
  "bg-brand-bg border border-[#81b7db] rounded-lg px-4 py-2 outline-none focus:border-[#0171bb] w-full";
const labelClass = "text-sm text-brand-muted mb-1 block";

// values = { name, shopName, phone, governorate, area, address, countries: [], brands: [] }
export default function SellerFields({ values, setValues }) {
  const { lang } = useLanguage();
  const x = siteText[lang];
  const governorate = egyptAreas.find((g) => g.key === values.governorate);

  function set(field, value) {
    setValues({ ...values, [field]: value });
  }

  function chooseGovernorate(key) {
    setValues({ ...values, governorate: key, area: "" });
  }

  function toggleCountry(key) {
    if (values.countries.includes(key)) {
      const countries = values.countries.filter((c) => c !== key);
      // Keep only the brands that still belong to a chosen country
      const stillThere = new Set(
        carBrands.filter((c) => countries.includes(c.key)).flatMap((c) => c.brands)
      );
      setValues({ ...values, countries, brands: values.brands.filter((b) => stillThere.has(b)) });
    } else {
      setValues({ ...values, countries: [...values.countries, key] });
    }
  }

  function toggleBrand(brand) {
    const brands = values.brands.includes(brand)
      ? values.brands.filter((b) => b !== brand)
      : [...values.brands, brand];
    set("brands", brands);
  }

  function selectAllBrands(country) {
    set("brands", Array.from(new Set([...values.brands, ...country.brands])));
  }

  function clearBrands(country) {
    set("brands", values.brands.filter((b) => !country.brands.includes(b)));
  }

  const chip = (active) =>
    "px-3 py-1 rounded-full text-sm border transition " +
    (active
      ? "bg-[#0171bb] text-white border-[#0171bb]"
      : "bg-white text-brand-text border-[#81b7db] hover:border-[#0171bb]");

  const chosenCountries = carBrands.filter((c) => values.countries.includes(c.key));

  return (
    <>
      <div>
        <label className={labelClass}>{x.fieldName}</label>
        <input
          type="text"
          value={values.name}
          onChange={(e) => set("name", e.target.value)}
          className={inputClass}
          maxLength={100}
          required
        />
      </div>

      <div>
        <label className={labelClass}>{x.fieldShopName}</label>
        <input
          type="text"
          value={values.shopName}
          onChange={(e) => set("shopName", e.target.value)}
          className={inputClass}
          maxLength={100}
        />
      </div>

      <div>
        <label className={labelClass}>{x.fieldPhone}</label>
        <input
          type="tel"
          value={values.phone}
          onChange={(e) => set("phone", e.target.value)}
          className={inputClass}
          maxLength={20}
          required
        />
      </div>

      <div>
        <label className={labelClass}>{x.fieldGovernorate}</label>
        <select
          value={values.governorate}
          onChange={(e) => chooseGovernorate(e.target.value)}
          className={inputClass}
          required
        >
          <option value="">{x.chooseGovernorate}</option>
          {egyptAreas.map((g) => (
            <option key={g.key} value={g.key}>
              {lang === "ar" ? g.ar : g.key}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className={labelClass}>{x.fieldArea}</label>
        <select
          value={values.area}
          onChange={(e) => set("area", e.target.value)}
          className={inputClass}
          disabled={!governorate}
          required
        >
          <option value="">{x.chooseArea}</option>
          {governorate &&
            governorate.areas.map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          {governorate && <option value="أخرى">{x.otherArea}</option>}
        </select>
      </div>

      <div>
        <label className={labelClass}>{x.fieldAddress}</label>
        <input
          type="text"
          value={values.address}
          onChange={(e) => set("address", e.target.value)}
          className={inputClass}
          maxLength={250}
          required
        />
      </div>

      <div>
        <label className={labelClass}>{x.fieldCountries}</label>
        <div className="flex flex-wrap gap-2">
          {carBrands.map((c) => (
            <button
              key={c.key}
              type="button"
              onClick={() => toggleCountry(c.key)}
              className={chip(values.countries.includes(c.key))}
            >
              {lang === "ar" ? c.ar : c.key}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className={labelClass}>{x.fieldBrands}</label>
        {chosenCountries.length === 0 && (
          <p className="text-sm text-brand-muted">{x.chooseCountryFirst}</p>
        )}
        {chosenCountries.map((country) => (
          <div key={country.key} className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-brand-text">
                {lang === "ar" ? country.ar : country.key}
              </span>
              <span className="flex gap-3 text-xs">
                <button
                  type="button"
                  onClick={() => selectAllBrands(country)}
                  className="text-[#0171bb] hover:underline"
                >
                  {x.selectAll}
                </button>
                <button
                  type="button"
                  onClick={() => clearBrands(country)}
                  className="text-brand-muted hover:underline"
                >
                  {x.clearAll}
                </button>
              </span>
            </div>
            <div className="flex flex-wrap gap-2 max-h-56 overflow-y-auto p-1">
              {country.brands.map((brand) => (
                <button
                  key={brand}
                  type="button"
                  onClick={() => toggleBrand(brand)}
                  className={chip(values.brands.includes(brand))}
                >
                  {brand}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
