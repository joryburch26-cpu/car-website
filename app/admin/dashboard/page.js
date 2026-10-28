"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

export default function AdminDashboard() {
  const router = useRouter();
  const [tab, setTab] = useState("sellers");
  const [sellers, setSellers] = useState([]);
  const [products, setProducts] = useState([]);
  const [visits, setVisits] = useState({ today: 0, week: 0, total: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUserAndLoad();
  }, []);

  async function checkUserAndLoad() {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      router.push("/admin/login");
      return;
    }

    const { data: isAdmin } = await supabase.rpc("is_admin");
    if (isAdmin !== true) {
      router.push("/admin/login");
      return;
    }

    loadData();
  }

  async function loadData() {
    setLoading(true);

    const { data: sellersData } = await supabase
      .from("sellers")
      .select("*")
      .order("created_at", { ascending: false });

    const { data: productsData } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    const { data: visitData } = await supabase
      .from("visit_counts")
      .select("day, visits")
      .order("day", { ascending: false });

    const todayText = new Date().toLocaleDateString("en-CA", { timeZone: "Africa/Cairo" });
    const weekStart = new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toLocaleDateString("en-CA", { timeZone: "Africa/Cairo" });
    let todayCount = 0;
    let weekCount = 0;
    let totalCount = 0;
    (visitData || []).forEach((row) => {
      totalCount += row.visits;
      if (row.day >= weekStart) weekCount += row.visits;
      if (row.day === todayText) todayCount += row.visits;
    });
    setVisits({ today: todayCount, week: weekCount, total: totalCount });

    setSellers(sellersData || []);
    setProducts(productsData || []);
    setLoading(false);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/admin/login");
  }

  async function removeSeller(sellerId, sellerEmail) {
    const confirmRemove = confirm(
      "Remove " + sellerEmail + " as a seller? All of their products will be deleted too. This cannot be undone."
    );
    if (!confirmRemove) return;

    await supabase.from("products").delete().eq("seller_id", sellerId);
    await supabase.from("sellers").delete().eq("user_id", sellerId);
    loadData();
  }

  async function deleteAccount(sellerId, sellerEmail) {
    const confirmDelete = confirm(
      "PERMANENTLY delete the account " + sellerEmail + "? Their login, seller profile and all of their products will be erased. This cannot be undone."
    );
    if (!confirmDelete) return;

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      router.push("/admin/login");
      return;
    }

    const response = await fetch("/api/admin/delete-user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + session.access_token,
      },
      body: JSON.stringify({ userId: sellerId }),
    });

    let result = {};
    try {
      result = await response.json();
    } catch (e) {
      result = {};
    }

    if (!response.ok) {
      alert("Could not delete the account: " + (result.error || response.status));
      return;
    }

    loadData();
  }

  async function deleteProduct(id) {
    const confirmDelete = confirm("Delete this product?");
    if (!confirmDelete) return;

    await supabase.from("products").delete().eq("id", id);
    loadData();
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-brand-bg text-brand-text flex items-center justify-center">
        <p>Loading...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-brand-bg text-brand-text px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold">Admin Dashboard</h1>
          <div className="flex gap-3">
            <a href="/" className="px-4 py-2 rounded-full border border-[#81b7db] hover:border-[#0171bb] transition text-sm">
              Back to Site
            </a>
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-full border border-[#81b7db] hover:border-[#0171bb] transition text-sm"
            >
              Log Out
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-8">
          <div className="bg-brand-card rounded-2xl p-4 text-center">
            <p className="text-2xl font-bold">{visits.today}</p>
            <p className="text-brand-muted text-xs mt-1">Visitors today</p>
          </div>
          <div className="bg-brand-card rounded-2xl p-4 text-center">
            <p className="text-2xl font-bold">{visits.week}</p>
            <p className="text-brand-muted text-xs mt-1">Last 7 days</p>
          </div>
          <div className="bg-brand-card rounded-2xl p-4 text-center">
            <p className="text-2xl font-bold">{visits.total}</p>
            <p className="text-brand-muted text-xs mt-1">All time</p>
          </div>
        </div>

        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setTab("sellers")}
            className={`px-4 py-2 rounded-full text-sm transition ${
              tab === "sellers" ? "bg-brand-accent text-white" : "border border-[#81b7db] hover:border-[#0171bb]"
            }`}
          >
            Sellers ({sellers.length})
          </button>
          <button
            onClick={() => setTab("products")}
            className={`px-4 py-2 rounded-full text-sm transition ${
              tab === "products" ? "bg-brand-accent text-white" : "border border-[#81b7db] hover:border-[#0171bb]"
            }`}
          >
            Products ({products.length})
          </button>
        </div>

        {tab === "sellers" && (
          <div className="bg-brand-card rounded-2xl overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-brand-muted border-b border-[#81b7db]">
                  <th className="p-4">Email</th>
                  <th className="p-4">Phone</th>
                  <th className="p-4">Country</th>
                  <th className="p-4">City</th>
                  <th className="p-4">Address</th>
                  <th className="p-4"></th>
                </tr>
              </thead>
              <tbody>
                {sellers.map((seller) => (
                  <tr key={seller.id} className="border-b border-[#81b7db] hover:bg-white/70">
                    <td className="p-4">{seller.email}</td>
                    <td className="p-4">{seller.phone}</td>
                    <td className="p-4">{seller.country}</td>
                    <td className="p-4">{seller.city}</td>
                    <td className="p-4">{seller.address}</td>
                    <td className="p-4">
                      <button
                        onClick={() => removeSeller(seller.user_id, seller.email)}
                        className="text-xs font-semibold text-red-600 hover:text-red-700"
                      >
                        Remove
                      </button>
                      <button
                        onClick={() => deleteAccount(seller.user_id, seller.email)}
                        className="text-xs font-semibold text-red-600 hover:text-red-600 ms-4"
                      >
                        Delete account
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {sellers.length === 0 && (
              <p className="text-center text-brand-muted py-10">No sellers yet.</p>
            )}
          </div>
        )}

        {tab === "products" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {products.map((product) => (
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
                  <p className="text-brand-muted text-sm">{product.brand} {product.model} {product.year}</p>
                  <p className="font-bold mt-1">{Number(product.price).toLocaleString()} EGP</p>
                  <p className="text-brand-muted text-xs mt-1">{product.city}</p>
                  <button
                    onClick={() => deleteProduct(product.id)}
                    className="text-red-600 hover:text-red-700 text-xs mt-3"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}

            {products.length === 0 && (
              <p className="text-center text-brand-muted py-10 col-span-full">No products yet.</p>
            )}
          </div>
        )}
      </div>
    </main>
  );
}