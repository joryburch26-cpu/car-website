"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setErrorMsg("Invalid email or password.");
    } else {
      router.push("/admin/dashboard");
    }
  }

  return (
    <main className="min-h-screen bg-brand-bg text-brand-text flex flex-col items-center justify-center px-6 gap-4">
      <form
        onSubmit={handleLogin}
        className="bg-brand-card rounded-2xl p-8 w-full max-w-sm flex flex-col gap-4"
      >
        <h1 className="text-2xl font-bold text-center mb-2">Admin Login</h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-brand-bg border border-zinc-700 rounded-lg px-4 py-2 outline-none focus:border-white"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="bg-brand-bg border border-zinc-700 rounded-lg px-4 py-2 outline-none focus:border-white"
          required
        />

        {errorMsg && (
          <p className="text-red-400 text-sm text-center">{errorMsg}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-2 bg-brand-accent text-black font-semibold px-6 py-3 rounded-full hover:bg-zinc-200 transition disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Log In"}
        </button>
      </form>

      <a href="/" className="text-brand-muted hover:text-white text-sm transition">
        ← Back to Home
      </a>
    </main>
  );
}