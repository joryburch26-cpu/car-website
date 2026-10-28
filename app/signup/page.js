"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import SellerFields from "../components/SellerFields";
import { supabase } from "../lib/supabaseClient";
import { isGoodImage, uploadImage } from "../lib/uploadImage";
import { useLanguage } from "../context/LanguageContext";
import { siteText } from "../data/siteText";
import egyptAreas from "../data/egyptAreas";

const inputClass =
  "bg-brand-bg border border-[#81b7db] rounded-lg px-4 py-2 outline-none focus:border-[#0171bb] w-full";
const labelClass = "text-sm text-brand-muted mb-1 block";

export default function Signup() {
  const router = useRouter();
  const { t, lang } = useLanguage();
  const x = siteText[lang];

  // "signup" is shown first; "login" is for sellers who already have an account
  const [mode, setMode] = useState("signup");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // Sign-up fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [values, setValues] = useState({
    name: "",
    shopName: "",
    phone: "",
    governorate: "",
    area: "",
    address: "",
    countries: [],
    brands: [],
  });

  // Log in fields
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // The "Log in" link in the menu opens this page with #login at the end
  useEffect(() => {
    function syncMode() {
      setMode(window.location.hash === "#login" ? "login" : "signup");
    }
    syncMode();
    window.addEventListener("hashchange", syncMode);
    return () => window.removeEventListener("hashchange", syncMode);
  }, []);

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

    setLoading(false);
    router.push("/profile");
  }

  async function handleSignup(e) {
    e.preventDefault();
    setErrorMsg("");

    if (
      !values.name.trim() ||
      !values.phone.trim() ||
      !values.governorate ||
      !values.area ||
      !values.address.trim()
    ) {
      setErrorMsg(x.fillRequired);
      return;
    }

    if (values.countries.length === 0 || values.brands.length === 0) {
      setErrorMsg(x.chooseOneCountryBrand);
      return;
    }

    if (avatarFile && !isGoodImage(avatarFile)) {
      setErrorMsg(x.photoBad);
      return;
    }

    setLoading(true);

    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error || !data.user) {
      setErrorMsg(error ? error.message : t.invalidLogin);
      setLoading(false);
      return;
    }

    const userId = data.user.id;
    const governorate = egyptAreas.find((g) => g.key === values.governorate);

    const { error: profileError } = await supabase.from("sellers").insert({
      user_id: userId,
      email: email,
      phone: values.phone.trim(),
      country: "Egypt",
      city: governorate ? governorate.ar : values.governorate,
      address: values.address.trim(),
      is_approved: true,
      name: values.name.trim(),
      shop_name: values.shopName.trim() || null,
      car_countries: values.countries,
      car_brands: values.brands,
      governorate: values.governorate,
      area: values.area,
    });

    if (profileError) {
      setErrorMsg(profileError.message);
      setLoading(false);
      return;
    }

    if (avatarFile) {
      const url = await uploadImage(avatarFile, userId, "avatar");
      if (url) {
        await supabase.from("sellers").update({ avatar_url: url }).eq("user_id", userId);
      }
    }

    setLoading(false);
    router.push("/profile");
  }

  const submitClass =
    "mt-2 bg-brand-accent text-white font-semibold px-6 py-3 rounded-full hover:bg-[#015a96] transition disabled:opacity-50";
  const linkButtonClass =
    "text-brand-muted hover:text-[#0171bb] text-sm text-center transition";

  // Log in screen for sellers who already have an account
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

            <button type="submit" disabled={loading} className={submitClass}>
              {loading ? t.loggingIn : t.logIn}
            </button>

            <button
              type="button"
              onClick={() => { setErrorMsg(""); setMode("signup"); }}
              className={linkButtonClass}
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
      <main className="min-h-screen bg-brand-bg text-brand-text flex items-center justify-center px-6 py-12">
        <form
          onSubmit={handleSignup}
          className="bg-brand-card rounded-2xl p-8 w-full max-w-xl flex flex-col gap-4"
        >
          <h1 className="text-2xl font-bold text-center mb-2">{t.createSellerAccount}</h1>

          <div>
            <label className={labelClass}>{t.email}</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
              required
            />
          </div>

          <div>
            <label className={labelClass}>{t.password}</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass}
              minLength={6}
              required
            />
          </div>

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

          {errorMsg && <p className="text-red-600 text-sm text-center">{errorMsg}</p>}

          <button type="submit" disabled={loading} className={submitClass}>
            {loading ? t.creatingAccount : t.signUp}
          </button>

          <button
            type="button"
            onClick={() => { setErrorMsg(""); setMode("login"); }}
            className={linkButtonClass}
          >
            {t.alreadyHaveAccount}
          </button>
        </form>
      </main>
    </>
  );
}
