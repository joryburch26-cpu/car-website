"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";
import { supabase } from "../../lib/supabaseClient";
import { useLanguage } from "../../context/LanguageContext";

export default function SellerDashboard() {
  const router = useRouter();
  const { t } = useLanguage();

  const [seller, setSeller] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [partName, setPartName] = useState("");
  const [isUniversal, setIsUniversal] = useState(false);
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [price, setPrice] = useState("");
  const [photoFiles, setPhotoFiles] = useState([]);
  const [photoPreviews, setPhotoPreviews] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(function () {
    loadEverything();
  }, []);

  async function loadEverything() {
    setLoading(true);

    const authResult = await supabase.auth.getUser();
    const user = authResult.data.user;

    if (!user) {
      router.push("/login");
      return;
    }

    const sellerResult = await supabase
      .from("sellers")
      .select("*")
      .eq("user_id", user.id)
      .single();

    setSeller(sellerResult.data);

    const productsResult = await supabase
      .from("products")
      .select("*")
      .eq("seller_id", user.id)
      .order("created_at", { ascending: false });

    setProducts(productsResult.data || []);
    setLoading(false);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  function handlePhotoChange(e) {
    const newFiles = Array.from(e.target.files);
    const newPreviews = newFiles.map(function (file) {
      return URL.createObjectURL(file);
    });

    setPhotoFiles(photoFiles.concat(newFiles));
    setPhotoPreviews(photoPreviews.concat(newPreviews));

    e.target.value = "";
  }

  function removePhoto(index) {
    setPhotoFiles(photoFiles.filter(function (_, i) { return i !== index; }));
    setPhotoPreviews(photoPreviews.filter(function (_, i) { return i !== index; }));
  }

  function resetForm() {
    setPartName("");
    setIsUniversal(false);
    setBrand("");
    setModel("");
    setYear("");
    setPrice("");
    setPhotoFiles([]);
    setPhotoPreviews([]);
  }

  function toggleUniversal() {
    const newValue = !isUniversal;
    setIsUniversal(newValue);
    if (newValue) {
      setBrand("");
      setModel("");
      setYear("");
    }
  }

  async function handleAddProduct(e) {
    e.preventDefault();
    setUploading(true);

    const uploadedUrls = [];

    for (let i = 0; i < photoFiles.length; i++) {
      const file = photoFiles[i];
      const fileName = Date.now() + "-" + file.name;

      const uploadResult = await supabase.storage
        .from("car-photos")
        .upload(fileName, file);

      if (!uploadResult.error) {
        const publicUrlResult = supabase.storage.from("car-photos").getPublicUrl(fileName);
        uploadedUrls.push(publicUrlResult.data.publicUrl);
      }
    }

    const insertResult = await supabase.from("products").insert({
      seller_id: seller.user_id,
      part_name: partName,
      brand: isUniversal ? null : brand,
      model: isUniversal ? null : model,
      year: isUniversal ? null : year,
      price: price,
      phone: seller.phone,
      city: seller.city,
      address: seller.address,
      photo_urls: uploadedUrls.join(", "),
    });

    setUploading(false);

    if (insertResult.error) {
      alert("Error adding product: " + insertResult.error.message);
      return;
    }

    resetForm();
    setShowSuccess(true);
    loadEverything();
  }

  async function handleDeleteProduct(id) {
    const confirmDelete = confirm("Delete this product?");
    if (!confirmDelete) return;

    await supabase.from("products").delete().eq("id", id);
    loadEverything();
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-brand-bg text-brand-text flex items-center justify-center">
          <p>{t.loadingCars}</p>
        </main>
      </>
    );
  }

  if (!seller) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-brand-bg text-brand-text flex flex-col items-center justify-center px-6 gap-4 text-center">
          <h1 className="text-2xl font-bold">{t.profileNotFoundTitle}</h1>
          <p className="text-brand-muted max-w-md">{t.profileNotFoundMsg}</p>
          <button onClick={handleLogout} className="px-4 py-2 rounded-full border border-zinc-600 hover:border-white transition text-sm">
            {t.logOut}
          </button>
        </main>
      </>
    );
  }

  const backToSiteLink = (
    <a href="/" className="px-4 py-2 rounded-full border border-zinc-600 hover:border-white transition text-sm">
      {t.backToSite}
    </a>
  );

  const backToHomeLink = (
    <a href="/" className="px-6 py-3 rounded-full border border-zinc-600 hover:border-white transition text-sm">
      {t.backToHome}
    </a>
  );

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-brand-bg text-brand-text px-6 py-10">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl md:text-3xl font-bold">{t.sellerDashboardTitle}</h1>

            <div className="flex gap-3">
              {backToSiteLink}

              <button onClick={handleLogout} className="px-4 py-2 rounded-full border border-zinc-600 hover:border-white transition text-sm">
                {t.logOut}
              </button>
            </div>
          </div>

          <form onSubmit={handleAddProduct} className="bg-brand-card rounded-2xl p-6 mb-10 flex flex-col gap-4">
            <h2 className="text-xl font-semibold">{t.addNewProduct}</h2>

            <input
              type="text"
              placeholder={t.partName}
              value={partName}
              onChange={function (e) { setPartName(e.target.value); }}
              className="bg-brand-bg border border-zinc-700 rounded-lg px-4 py-2 outline-none focus:border-white"
              required
            />

            <label className="flex items-center gap-2 text-sm text-brand-muted cursor-pointer">
              <input
                type="checkbox"
                checked={isUniversal}
                onChange={toggleUniversal}
                className="w-4 h-4"
              />
              {t.universalPart}
            </label>

            {isUniversal === false && (
              <>
                <input
                  type="text"
                  placeholder={t.selectBrand}
                  value={brand}
                  onChange={function (e) { setBrand(e.target.value); }}
                  className="bg-brand-bg border border-zinc-700 rounded-lg px-4 py-2 outline-none focus:border-white"
                />

                <input
                  type="text"
                  placeholder={t.selectModel}
                  value={model}
                  onChange={function (e) { setModel(e.target.value); }}
                  className="bg-brand-bg border border-zinc-700 rounded-lg px-4 py-2 outline-none focus:border-white"
                />

                <input
                  type="number"
                  placeholder={t.manufacturingYearPlaceholder}
                  value={year}
                  onChange={function (e) { setYear(e.target.value); }}
                  className="bg-brand-bg border border-zinc-700 rounded-lg px-4 py-2 outline-none focus:border-white"
                />
              </>
            )}

            <input
              type="number"
              placeholder={t.priceEgp}
              value={price}
              onChange={function (e) { setPrice(e.target.value); }}
              className="bg-brand-bg border border-zinc-700 rounded-lg px-4 py-2 outline-none focus:border-white"
            />

            <div className="flex items-center gap-3">
              <label className="bg-brand-accent text-black font-semibold px-4 py-2 rounded-full cursor-pointer hover:bg-zinc-200 transition text-sm">
                {t.chooseFiles}
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handlePhotoChange}
                  className="hidden"
                />
              </label>

              <span className="text-sm text-brand-muted">
                {photoFiles.length > 0 ? t.filesSelected.replace("{n}", photoFiles.length) : t.noFileChosen}
              </span>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {photoPreviews.map(function (src, i) {
                return (
                  <div key={i} className="relative">
                    <img src={src} alt="preview" className="w-full h-20 object-cover rounded-lg" />
                    <button
                      type="button"
                      onClick={function () { removePhoto(i); }}
                      className="absolute top-1 right-1 bg-black/70 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center"
                    >
                      ×
                    </button>
                  </div>
                );
              })}
            </div>

            <button
              type="submit"
              disabled={uploading}
              className="bg-brand-accent text-black font-semibold px-6 py-3 rounded-full hover:bg-zinc-200 transition disabled:opacity-50"
            >
              {uploading ? t.adding : t.addProduct}
            </button>
          </form>

          <h2 className="text-xl font-semibold mb-4">
            {t.yourProducts} ({products.length})
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {products.map(function (product) {
              const hasCarInfo = product.brand || product.model || product.year;
              const carInfoText = hasCarInfo
                ? (product.brand || "") + " " + (product.model || "") + " " + (product.year || "")
                : t.fitsAnyCar;

              return (
                <div key={product.id} className="bg-brand-card rounded-2xl overflow-hidden">
                  {product.photo_urls && (
                    <img
                      src={product.photo_urls.split(", ")[0]}
                      alt={product.part_name}
                      className="w-full h-32 object-cover"
                    />
                  )}

                  <div className="p-4">
                    <h3 className="font-semibold">{product.part_name}</h3>
                    <p className="text-brand-muted text-sm">{carInfoText}</p>
                    <p className="font-bold mt-1">{Number(product.price).toLocaleString()} EGP</p>
                    <button
                      onClick={function () { handleDeleteProduct(product.id); }}
                      className="text-red-400 hover:text-red-300 text-xs mt-3"
                    >
                      {t.delete}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {products.length === 0 && (
            <p className="text-center text-zinc-500 mt-10">{t.noProductsYet}</p>
          )}
        </div>
      </main>

      {showSuccess === true && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center px-6 z-50">
          <div className="bg-brand-card rounded-2xl p-8 max-w-sm w-full text-center flex flex-col gap-4">
            <h2 className="text-xl font-bold">{t.productAddedTitle}</h2>
            <p className="text-brand-muted">{t.productAddedMsg}</p>

            <div className="flex flex-col gap-2">
              <button
                onClick={function () { setShowSuccess(false); }}
                className="bg-brand-accent text-black font-semibold px-6 py-3 rounded-full hover:bg-zinc-200 transition"
              >
                {t.addAnother}
              </button>

              {backToHomeLink}
            </div>
          </div>
        </div>
      )}
    </>
  );
}