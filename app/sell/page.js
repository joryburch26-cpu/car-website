"use client";
import { useState } from "react";
import Navbar from "../components/Navbar";
import { supabase } from "../lib/supabaseClient";
import { useLanguage } from "../context/LanguageContext";

export default function SellPage() {
  const { t } = useLanguage();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    partName: "",
    brand: "",
    model: "",
    price: "",
    name: "",
    phone: "",
    location: "",
    address: "",
  });
  const [photoFiles, setPhotoFiles] = useState([]);
  const [photoPreviews, setPhotoPreviews] = useState([]);
  const [uploading, setUploading] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  }

  function handlePhotoChange(e) {
    const files = Array.from(e.target.files);
    const previews = files.map((file) => URL.createObjectURL(file));
    setPhotoFiles(files);
    setPhotoPreviews(previews);
  }

  function nextStep() {
    setStep(step + 1);
  }

  function prevStep() {
    setStep(step - 1);
  }

  async function handleSubmit() {
    setUploading(true);

    const uploadedUrls = [];

    for (const file of photoFiles) {
      const fileName = `${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from("car-photos")
        .upload(fileName, file);

      if (uploadError) {
        console.log("Upload error:", uploadError);
        continue;
      }

      const { data } = supabase.storage
        .from("car-photos")
        .getPublicUrl(fileName);

      uploadedUrls.push(data.publicUrl);
    }

    const { error } = await supabase.from("submissions").insert({
      part_name: formData.partName,
      brand: formData.brand,
      model: formData.model,
      price: formData.price,
      name: formData.name,
      phone: formData.phone,
      location: formData.location,
      address: formData.address,
      status: "New",
      is_public: false,
      photo_urls: uploadedUrls.join(", "),
    });

    setUploading(false);

    if (error) {
      console.log("Error saving submission:", error);
      alert("Something went wrong. Please try again.");
    } else {
      setStep(5);
    }
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-brand-bg text-brand-text px-6 py-16">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-2">
          {t.sellTitle}
        </h1>
        {step <= 4 && (
          <p className="text-brand-muted text-center mb-10">
            {t.stepOf.replace("{n}", step).replace("5", "4")}
          </p>
        )}

        <div className="max-w-lg mx-auto bg-brand-card rounded-2xl p-8">
          {step === 1 && (
            <div className="flex flex-col gap-4">
              <h2 className="text-xl font-semibold mb-2">{t.partInformation}</h2>

              <input
                type="text"
                name="partName"
                placeholder={t.partName}
                value={formData.partName}
                onChange={handleChange}
                className="bg-brand-bg border border-zinc-700 rounded-lg px-4 py-2 outline-none focus:border-white"
              />

              <input
                type="text"
                name="brand"
                placeholder={t.selectBrand}
                value={formData.brand}
                onChange={handleChange}
                className="bg-brand-bg border border-zinc-700 rounded-lg px-4 py-2 outline-none focus:border-white"
              />

              <input
                type="text"
                name="model"
                placeholder={t.selectModel}
                value={formData.model}
                onChange={handleChange}
                className="bg-brand-bg border border-zinc-700 rounded-lg px-4 py-2 outline-none focus:border-white"
              />

              <input
                type="number"
                name="price"
                placeholder={t.askingPrice}
                value={formData.price}
                onChange={handleChange}
                className="bg-brand-bg border border-zinc-700 rounded-lg px-4 py-2 outline-none focus:border-white"
              />

              <button
                onClick={nextStep}
                disabled={!formData.partName}
                className="mt-4 bg-brand-accent text-black font-semibold px-6 py-3 rounded-full hover:bg-zinc-200 transition disabled:opacity-50"
              >
                {t.next}
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="flex flex-col gap-4">
              <h2 className="text-xl font-semibold mb-2">{t.carPhotos}</h2>

              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handlePhotoChange}
                className="text-sm text-brand-muted file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-brand-accent file:text-black file:font-semibold"
              />

              <div className="grid grid-cols-3 gap-3 mt-2">
                {photoPreviews.map((src, index) => (
                  <img
                    key={index}
                    src={src}
                    alt="part preview"
                    className="w-full h-24 object-cover rounded-lg"
                  />
                ))}
              </div>

              <div className="flex justify-between mt-4">
                <button
                  onClick={prevStep}
                  className="px-6 py-3 rounded-full border border-zinc-600 hover:border-white transition"
                >
                  {t.back}
                </button>
                <button
                  onClick={nextStep}
                  disabled={photoPreviews.length === 0}
                  className="bg-brand-accent text-black font-semibold px-6 py-3 rounded-full hover:bg-zinc-200 transition disabled:opacity-50"
                >
                  {t.next}
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="flex flex-col gap-4">
              <h2 className="text-xl font-semibold mb-2">{t.contactInformation}</h2>

              <input
                type="text"
                name="name"
                placeholder={t.fullName}
                value={formData.name}
                onChange={handleChange}
                className="bg-brand-bg border border-zinc-700 rounded-lg px-4 py-2 outline-none focus:border-white"
              />

              <input
                type="tel"
                name="phone"
                placeholder={t.phoneNumber}
                value={formData.phone}
                onChange={handleChange}
                className="bg-brand-bg border border-zinc-700 rounded-lg px-4 py-2 outline-none focus:border-white"
              />

              <input
                type="text"
                name="location"
                placeholder={t.city}
                value={formData.location}
                onChange={handleChange}
                className="bg-brand-bg border border-zinc-700 rounded-lg px-4 py-2 outline-none focus:border-white"
              />

              <input
                type="text"
                name="address"
                placeholder={t.shopAddress}
                value={formData.address}
                onChange={handleChange}
                className="bg-brand-bg border border-zinc-700 rounded-lg px-4 py-2 outline-none focus:border-white"
              />

              <div className="flex justify-between mt-4">
                <button
                  onClick={prevStep}
                  className="px-6 py-3 rounded-full border border-zinc-600 hover:border-white transition"
                >
                  {t.back}
                </button>
                <button
                  onClick={nextStep}
                  disabled={!formData.name || !formData.phone || !formData.location || !formData.address}
                  className="bg-brand-accent text-black font-semibold px-6 py-3 rounded-full hover:bg-zinc-200 transition disabled:opacity-50"
                >
                  {t.next}
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="flex flex-col gap-4">
              <h2 className="text-xl font-semibold mb-2">{t.reviewSubmission}</h2>

              <div className="text-sm text-brand-muted flex flex-col gap-2">
                <p><span className="text-zinc-500">{t.partName}:</span> {formData.partName}</p>
                <p><span className="text-zinc-500">Brand:</span> {formData.brand}</p>
                <p><span className="text-zinc-500">Model:</span> {formData.model}</p>
                <p><span className="text-zinc-500">Price:</span> {formData.price} EGP</p>
                <p><span className="text-zinc-500">Name:</span> {formData.name}</p>
                <p><span className="text-zinc-500">Phone:</span> {formData.phone}</p>
                <p><span className="text-zinc-500">City:</span> {formData.location}</p>
                <p><span className="text-zinc-500">Address:</span> {formData.address}</p>
                <p><span className="text-zinc-500">Photos uploaded:</span> {photoPreviews.length}</p>
              </div>

              <div className="grid grid-cols-3 gap-3 mt-2">
                {photoPreviews.map((src, index) => (
                  <img
                    key={index}
                    src={src}
                    alt="part preview"
                    className="w-full h-24 object-cover rounded-lg"
                  />
                ))}
              </div>

              <div className="flex justify-between mt-4">
                <button
                  onClick={prevStep}
                  className="px-6 py-3 rounded-full border border-zinc-600 hover:border-white transition"
                >
                  {t.back}
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={uploading}
                  className="bg-brand-accent text-black font-semibold px-6 py-3 rounded-full hover:bg-zinc-200 transition disabled:opacity-50"
                >
                  {uploading ? t.submitting : t.submit}
                </button>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="text-center flex flex-col items-center gap-3 py-6">
              <h2 className="text-2xl font-bold">{t.thankYou}</h2>
              <p className="text-brand-muted">{t.thankYouMsg}</p>
            </div>
          )}
        </div>
      </main>
    </>
  );
}