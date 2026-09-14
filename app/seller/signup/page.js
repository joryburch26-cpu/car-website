"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";
import { supabase } from "../../lib/supabaseClient";
import { useLanguage } from "../../context/LanguageContext";
import governorates from "../../data/governorates";

export default function SellerSignup() {
  const router = useRouter();
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    phone: "",
    country: "",
    city: "",
    address: "",
  });
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  }

  async function handleSignup(e) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    const { data, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
    });

    if (error) {
      setErrorMsg(error.message);
      setLoading(false);
      return;
    }

    const userId = data.user.id;

    const { error: profileError } = await supabase.from("sellers").insert({
      user_id: userId,
      email: formData.email,
      phone: formData.phone,
      country: formData.country,
      city: formData.city,
      address: formData.address,
      is_approved: false,
    });

    setLoading(false);

    if (profileError) {
      setErrorMsg(profileError.message);
      return;
    }

    router.push("/seller/dashboard");
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-brand-bg text-brand-text flex items-center justify-center px-6 py-16">
        <form
          onSubmit={handleSignup}
          className="bg-brand-card rounded-2xl p-8 w-full max-w-md flex flex-col gap-4"
        >
          <h1 className="text-2xl font-bold text-center mb-2">{t.createSellerAccount}</h1>

          <input
            type="email"
            name="email"
            placeholder={t.email}
            value={formData.email}
            onChange={handleChange}
            className="bg-brand-bg border border-zinc-700 rounded-lg px-4 py-2 outline-none focus:border-white"
            required
          />

          <input
            type="password"
            name="password"
            placeholder={t.password}
            value={formData.password}
            onChange={handleChange}
            className="bg-brand-bg border border-zinc-700 rounded-lg px-4 py-2 outline-none focus:border-white"
            required
          />

          <input
            type="tel"
            name="phone"
            placeholder={t.phoneNumber}
            value={formData.phone}
            onChange={handleChange}
            className="bg-brand-bg border border-zinc-700 rounded-lg px-4 py-2 outline-none focus:border-white"
            required
          />

          <input
            type="text"
            name="country"
            placeholder={t.country}
            value={formData.country}
            onChange={handleChange}
            className="bg-brand-bg border border-zinc-700 rounded-lg px-4 py-2 outline-none focus:border-white"
            required
          />

          <select
            name="city"
            value={formData.city}
            onChange={handleChange}
            className="bg-brand-bg border border-zinc-700 rounded-lg px-4 py-2 outline-none focus:border-white"
            required
          >
            <option value="">{t.selectGovernorate}</option>
            {governorates.map((gov) => (
              <option key={gov} value={gov}>{gov}</option>
            ))}
          </select>

          <input
            type="text"
            name="address"
            placeholder={t.shopAddress}
            value={formData.address}
            onChange={handleChange}
            className="bg-brand-bg border border-zinc-700 rounded-lg px-4 py-2 outline-none focus:border-white"
            required
          />

          {errorMsg && <p className="text-red-400 text-sm text-center">{errorMsg}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 bg-brand-accent text-black font-semibold px-6 py-3 rounded-full hover:bg-zinc-200 transition disabled:opacity-50"
          >
            {loading ? t.creatingAccount : t.signUp}
          </button>

          <a href="/seller/login" className="text-brand-muted hover:text-white text-sm text-center transition">
            {t.alreadyHaveAccount}
          </a>
        </form>
      </main>
    </>
  );
}