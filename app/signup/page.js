"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import { supabase } from "../lib/supabaseClient";
import { useLanguage } from "../context/LanguageContext";
import governorates from "../data/governorates";

export default function Signup() {
  const router = useRouter();
  const { t } = useLanguage();

  // Only sellers have accounts now
  const accountType = "seller";

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

  // "signup" is shown first; "login" is for people who already have an account
  const [mode, setMode] = useState("signup");

  // The "Log in" link in the menu opens this page with #login at the end
  useEffect(() => {
    function syncMode() {
      setMode(window.location.hash === "#login" ? "login" : "signup");
    }
    syncMode();
    window.addEventListener("hashchange", syncMode);
    return () => window.removeEventListener("hashchange", syncMode);
  }, []);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    const { data, error } = await supabase.auth.signInWithPassword({
      email: loginEmail,
      password: loginPassword,
    });

    if (error || !data.user) {
      setLoading(false);
      setErrorMsg(t.invalidLogin);
      return;
    }

    // Sellers go to their dashboard, buyers go to the search page
    const { data: sellerRow } = await supabase
      .from("sellers")
      .select("user_id")
      .eq("user_id", data.user.id)
      .maybeSingle();

    setLoading(false);
    router.push(sellerRow ? "/seller/dashboard" : "/");
  }

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
      options: { data: { role: accountType } },
    });

    if (error || !data.user) {
      setErrorMsg(error ? error.message : t.invalidLogin);
      setLoading(false);
      return;
    }

    if (accountType === "seller") {
      const { error: profileError } = await supabase.from("sellers").insert({
        user_id: data.user.id,
        email: formData.email,
        phone: formData.phone,
        country: formData.country,
        city: formData.city,
        address: formData.address,
        is_approved: true,
      });

      setLoading(false);

      if (profileError) {
        setErrorMsg(profileError.message);
        return;
      }

      router.push("/seller/dashboard");
      return;
    }

    // Buyers go straight to the search page
    setLoading(false);
    router.push("/");
  }

  const inputClass =
    "bg-brand-bg border border-[#81b7db] rounded-lg px-4 py-2 outline-none focus:border-[#0171bb]";

  // Log in screen for people who already have an account
  if (mode === "login") {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-brand-bg text-brand-text flex flex-col items-center justify-center px-6 gap-4">
          <form
            onSubmit={handleLogin}
            className="bg-brand-card rounded-2xl p-8 w-full max-w-sm flex flex-col gap-4"
          >
            <h1 className="text-2xl font-bold text-center mb-2">{t.loginTitle}</h1>

            <input
              type="email"
              placeholder={t.email}
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              className={inputClass}
              required
            />

            <input
              type="password"
              placeholder={t.password}
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              className={inputClass}
              required
            />

            {errorMsg && <p className="text-red-600 text-sm text-center">{errorMsg}</p>}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 bg-brand-accent text-white font-semibold px-6 py-3 rounded-full hover:bg-[#015a96] transition disabled:opacity-50"
            >
              {loading ? t.loggingIn : t.logIn}
            </button>

            <button
              type="button"
              onClick={() => { setErrorMsg(""); setMode("signup"); }}
              className="text-brand-muted hover:text-[#0171bb] text-sm text-center transition"
            >
              {t.dontHaveAccount}
            </button>
          </form>
        </main>
      </>
    );
  }

  // The seller sign-up form
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-brand-bg text-brand-text flex items-center justify-center px-6 py-16">
        <form
          onSubmit={handleSignup}
          className="bg-brand-card rounded-2xl p-8 w-full max-w-md flex flex-col gap-4"
        >
          <h1 className="text-2xl font-bold text-center mb-2">
            {t.createSellerAccount}
          </h1>

          <input
            type="email"
            name="email"
            placeholder={t.email}
            value={formData.email}
            onChange={handleChange}
            className={inputClass}
            required
          />

          <input
            type="password"
            name="password"
            placeholder={t.password}
            value={formData.password}
            onChange={handleChange}
            className={inputClass}
            required
          />

          {accountType === "seller" && (
            <>
              <input
                type="tel"
                name="phone"
                placeholder={t.phoneNumber}
                value={formData.phone}
                onChange={handleChange}
                className={inputClass}
                required
              />

              <input
                type="text"
                name="country"
                placeholder={t.country}
                value={formData.country}
                onChange={handleChange}
                className={inputClass}
                required
              />

              <select
                name="city"
                value={formData.city}
                onChange={handleChange}
                className={inputClass}
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
                className={inputClass}
                required
              />
            </>
          )}

          {errorMsg && <p className="text-red-600 text-sm text-center">{errorMsg}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 bg-brand-accent text-white font-semibold px-6 py-3 rounded-full hover:bg-[#015a96] transition disabled:opacity-50"
          >
            {loading ? t.creatingAccount : t.signUp}
          </button>

          <button
            type="button"
            onClick={() => { setErrorMsg(""); setMode("login"); }}
            className="text-brand-muted hover:text-[#0171bb] text-sm text-center transition"
          >
            {t.alreadyHaveAccount}
          </button>
        </form>
      </main>
    </>
  );
}
