"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";
import { supabase } from "../../lib/supabaseClient";
import { useLanguage } from "../../context/LanguageContext";

export default function SellerLogin() {
  const router = useRouter();
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    setLoading(false);

    if (error) {
      setErrorMsg(t.invalidLogin);
    } else {
      router.push("/seller/dashboard");
    }
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-brand-bg text-brand-text flex flex-col items-center justify-center px-6 gap-4">
        <form
          onSubmit={handleLogin}
          className="bg-brand-card rounded-2xl p-8 w-full max-w-sm flex flex-col gap-4"
        >
          <h1 className="text-2xl font-bold text-center mb-2">{t.sellerLogin}</h1>

          <input
            type="email"
            placeholder={t.email}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-brand-bg border border-zinc-700 rounded-lg px-4 py-2 outline-none focus:border-white"
            required
          />

          <input
            type="password"
            placeholder={t.password}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-brand-bg border border-zinc-700 rounded-lg px-4 py-2 outline-none focus:border-white"
            required
          />

          {errorMsg && <p className="text-red-400 text-sm text-center">{errorMsg}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 bg-brand-accent text-black font-semibold px-6 py-3 rounded-full hover:bg-zinc-200 transition disabled:opacity-50"
          >
            {loading ? t.loggingIn : t.logIn}
          </button>

          <a href="/seller/signup" className="text-brand-muted hover:text-white text-sm text-center transition">
            {t.dontHaveAccount}
          </a>
        </form>
      </main>
    </>
  );
}