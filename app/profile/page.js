"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import SellerFields from "../components/SellerFields";
import { supabase } from "../lib/supabaseClient";
import { isGoodImage, uploadImage, deleteImage } from "../lib/uploadImage";
import { useLanguage } from "../context/LanguageContext";
import { siteText } from "../data/siteText";
import egyptAreas from "../data/egyptAreas";
import carBrands from "../data/carBrands";

const inputClass =
  "bg-brand-bg border border-[#81b7db] rounded-lg px-4 py-2 outline-none focus:border-[#0171bb] w-full";
const labelClass = "text-sm text-brand-muted mb-1 block";

export default function Profile() {
  const router = useRouter();
  const { lang } = useLanguage();
  const x = siteText[lang];

  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [seller, setSeller] = useState(null);
  const [stock, setStock] = useState([]);

  const [editing, setEditing] = useState(false);
  const [values, setValues] = useState(null);
  const [contactEmail, setContactEmail] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [uploadingStock, setUploadingStock] = useState(false);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      window.location.replace("/signup#login");
      return;
    }

    setUserId(user.id);

    const { data: sellerRow } = await supabase
      .from("sellers")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    setSeller(sellerRow);

    const { data: stockRows } = await supabase
      .from("stock_photos")
      .select("id, url")
      .eq("seller_id", user.id)
      .order("created_at", { ascending: false });

    setStock(stockRows || []);
    setLoading(false);
  }

  function startEditing() {
    setValues({
      name: seller.name || "",
      shopName: seller.shop_name || "",
      phone: seller.phone || "",
      governorate: seller.governorate || "",
      area: seller.area || "",
      address: seller.address || "",
      parts: seller.parts || "",
      countries: seller.car_countries || [],
      brands: seller.car_brands || [],
    });
    setContactEmail(seller.email || "");
    setAvatarFile(null);
    setMessage("");
    setEditing(true);
  }

  async function handleSave(e) {
    e.preventDefault();
    setMessage("");

    if (
      !values.name.trim() ||
      !values.phone.trim() ||
      !values.governorate ||
      !values.area ||
      !values.address.trim()
    ) {
      setMessage(x.fillRequired);
      return;
    }

    if (values.countries.length === 0 || values.brands.length === 0) {
      setMessage(x.chooseOneCountryBrand);
      return;
    }

    if (avatarFile && !isGoodImage(avatarFile)) {
      setMessage(x.photoBad);
      return;
    }

    setSaving(true);

    const governorate = egyptAreas.find((g) => g.key === values.governorate);
    const changes = {
      name: values.name.trim(),
      shop_name: values.shopName.trim() || null,
      parts: values.parts.trim() || null,
      phone: values.phone.trim(),
      email: contactEmail.trim(),
      governorate: values.governorate,
      city: governorate ? governorate.ar : values.governorate,
      area: values.area,
      address: values.address.trim(),
      car_countries: values.countries,
      car_brands: values.brands,
    };

    if (avatarFile) {
      const url = await uploadImage(avatarFile, userId, "avatar");
      if (!url) {
        setSaving(false);
        setMessage(x.photoBad);
        return;
      }
      if (seller.avatar_url) await deleteImage(seller.avatar_url);
      changes.avatar_url = url;
    }

    const { data: updatedRows, error } = await supabase
      .from("sellers")
      .update(changes)
      .eq("user_id", userId)
      .select("user_id");

    if (error) {
      setSaving(false);
      setMessage(error.message);
      return;
    }

    if (!updatedRows || updatedRows.length === 0) {
      setSaving(false);
      setMessage(x.saveFailed);
      return;
    }

    // Read the profile again from the database, so the page shows what is really saved
    await load();
    setSaving(false);
    setEditing(false);
    setMessage(x.saved);
  }

  async function handleAddStock(e) {
    const files = Array.from(e.target.files || []);
    e.target.value = "";
    if (files.length === 0) return;

    setUploadingStock(true);
    setMessage("");
    let failed = false;

    for (const file of files) {
      if (!isGoodImage(file)) {
        failed = true;
        continue;
      }
      const url = await uploadImage(file, userId, "stock");
      if (!url) {
        failed = true;
        continue;
      }
      const { error } = await supabase.from("stock_photos").insert({ seller_id: userId, url });
      if (error) failed = true;
    }

    const { data: stockRows } = await supabase
      .from("stock_photos")
      .select("id, url")
      .eq("seller_id", userId)
      .order("created_at", { ascending: false });

    setStock(stockRows || []);
    setUploadingStock(false);
    if (failed) setMessage(x.uploadFailed);
  }

  async function handleDeleteStock(photo) {
    if (!confirm(x.confirmDeletePhoto)) return;
    await deleteImage(photo.url);
    await supabase.from("stock_photos").delete().eq("id", photo.id);
    setStock(stock.filter((p) => p.id !== photo.id));
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-bg text-brand-text flex flex-col">
        <SiteHeader />
        <p className="flex-1 text-center text-brand-muted py-20">{x.loadingText}</p>
      </div>
    );
  }

  if (!seller) {
    return (
      <div className="min-h-screen bg-brand-bg text-brand-text flex flex-col">
        <SiteHeader />
        <p className="flex-1 text-center text-brand-muted py-20">{x.profileMissing}</p>
      </div>
    );
  }

  const governorate = egyptAreas.find((g) => g.key === seller.governorate);
  const governorateName = governorate ? (lang === "ar" ? governorate.ar : governorate.key) : seller.city;
  const countries = (seller.car_countries || []).map((key) => {
    const c = carBrands.find((item) => item.key === key);
    return c ? (lang === "ar" ? c.ar : c.key) : key;
  });
  const brands = seller.car_brands || [];
  const initial = (seller.name || seller.email || "?").trim().charAt(0).toUpperCase();

  const row = (label, value) => (
    <div>
      <p className="text-sm text-brand-muted">{label}</p>
      <p className="text-brand-text">{value || x.notAdded}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-brand-bg text-brand-text flex flex-col">
      <SiteHeader />

      <main className="flex-1 w-full max-w-3xl mx-auto px-4 py-8 flex flex-col gap-8">
        {/* Top of the profile: picture and names */}
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
            <h1 className="text-2xl font-bold">{seller.name || x.notAdded}</h1>
            {seller.shop_name && <p className="text-brand-muted">{seller.shop_name}</p>}
            {!editing && (
              <button
                onClick={startEditing}
                className="mt-3 border border-[#0171bb] text-[#0171bb] text-sm font-semibold px-4 py-1 rounded-full hover:bg-[#e4f1f9] transition"
              >
                {x.editProfile}
              </button>
            )}
          </div>
        </section>

        {message && !editing && <p className="text-sm text-[#0171bb]">{message}</p>}

        {editing ? (
          <form onSubmit={handleSave} className="bg-brand-card rounded-2xl p-6 flex flex-col gap-4">
            <div>
              <label className={labelClass}>{x.profilePhoto}</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setAvatarFile(e.target.files && e.target.files[0] ? e.target.files[0] : null)}
                className="text-sm"
              />
              <p className="text-xs text-brand-muted mt-1">{x.photoHint}</p>
            </div>

            <SellerFields values={values} setValues={setValues} />

            <div>
              <label className={labelClass}>{x.fieldContactEmail}</label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className={inputClass}
                required
              />
            </div>

            {message && <p className="text-red-600 text-sm">{message}</p>}

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={saving}
                className="bg-brand-accent text-white font-semibold px-6 py-2 rounded-full hover:bg-[#015a96] transition disabled:opacity-50"
              >
                {saving ? x.saving : x.saveProfile}
              </button>
              <button
                type="button"
                onClick={() => { setEditing(false); setMessage(""); }}
                className="border border-[#81b7db] px-6 py-2 rounded-full hover:border-[#0171bb] transition"
              >
                {x.cancel}
              </button>
            </div>
          </form>
        ) : (
          <section className="bg-brand-card rounded-2xl p-6 grid gap-4 sm:grid-cols-2">
            {row(x.fieldPhone, seller.phone)}
            {row(x.fieldContactEmail, seller.email)}
            {row(x.fieldGovernorate, governorateName)}
            {row(x.fieldArea, seller.area)}
            <div className="sm:col-span-2">{row(x.fieldAddress, seller.address)}</div>
            <div className="sm:col-span-2">{row(x.fieldParts, seller.parts)}</div>

            <div className="sm:col-span-2">
              <p className="text-sm text-brand-muted mb-2">{x.carsIWorkOn}</p>
              {countries.length === 0 && brands.length === 0 ? (
                <p>{x.notAdded}</p>
              ) : (
                <>
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
                </>
              )}
            </div>
          </section>
        )}

        {/* Stock pictures (optional) */}
        <section>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-bold">{x.myStock}</h2>
            <label className="cursor-pointer bg-brand-accent text-white text-sm font-semibold px-4 py-2 rounded-full hover:bg-[#015a96] transition">
              {uploadingStock ? x.uploading : x.addStockPhotos}
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleAddStock}
                disabled={uploadingStock}
                className="hidden"
              />
            </label>
          </div>
          <p className="text-sm text-brand-muted mb-4">{x.stockHint}</p>

          {stock.length === 0 ? (
            <p className="text-brand-muted">{x.noStock}</p>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {stock.map((photo) => (
                <div key={photo.id} className="relative aspect-square">
                  <img src={photo.url} alt="" className="w-full h-full object-cover rounded-lg" />
                  <button
                    type="button"
                    onClick={() => handleDeleteStock(photo)}
                    aria-label={x.deleteLabel}
                    className="absolute top-1 end-1 bg-white/90 text-red-600 w-7 h-7 rounded-full text-lg leading-none shadow hover:bg-white"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
