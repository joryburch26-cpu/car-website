"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

export default function AdminDashboard() {
  const router = useRouter();
  const [tab, setTab] = useState("sellers");
  const [sellers, setSellers] = useState([]);
  const [products, setProducts] = useState([]);
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

    setSellers(sellersData || []);
    setProducts(productsData || []);
    setLoading(false);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/admin/login");
  }

  async function toggleApproval(sellerId, currentValue) {
    await supabase.from("sellers").update({ is_approved: !currentValue }).eq("user_id", sellerId);
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
            <a href="/" className="px-4 py-2 rounded-full border border-zinc-600 hover:border-white transition text-sm">
              Back to Site
            </a>
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-full border border-zinc-600 hover:border-white transition text-sm"
            >
              Log Out
            </button>
          </div>
        </div>

        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setTab("sellers")}
            className={`px-4 py-2 rounded-full text-sm transition ${
              tab === "sellers" ? "bg-brand-accent text-black" : "border border-zinc-600 hover:border-white"
            }`}
          >
            Sellers ({sellers.length})
          </button>
          <button
            onClick={() => setTab("products")}
            className={`px-4 py-2 rounded-full text-sm transition ${
              tab === "products" ? "bg-brand-accent text-black" : "border border-zinc-600 hover:border-white"
            }`}
          >
            Products ({products.length})
          </button>
        </div>

        {tab === "sellers" && (
          <div className="bg-brand-card rounded-2xl overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-brand-muted border-b border-zinc-700">
                  <th className="p-4">Email</th>
                  <th className="p-4">Phone</th>
                  <th className="p-4">Country</th>
                  <th className="p-4">City</th>
                  <th className="p-4">Address</th>
                  <th className="p-4">Status</th>
                  <th className="p-4"></th>
                </tr>
              </thead>
              <tbody>
                {sellers.map((seller) => (
                  <tr key={seller.id} className="border-b border-zinc-700 hover:bg-zinc-700/40">
                    <td className="p-4">{seller.email}</td>
                    <td className="p-4">{seller.phone}</td>
                    <td className="p-4">{seller.country}</td>
                    <td className="p-4">{seller.city}</td>
                    <td className="p-4">{seller.address}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs ${seller.is_approved ? "bg-green-700" : "bg-zinc-700"}`}>
                        {seller.is_approved ? "Approved" : "Pending"}
                      </span>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => toggleApproval(seller.user_id, seller.is_approved)}
                        className={`text-xs font-semibold ${
                          seller.is_approved ? "text-red-400 hover:text-red-300" : "text-green-400 hover:text-green-300"
                        }`}
                      >
                        {seller.is_approved ? "Revoke" : "Approve"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {sellers.length === 0 && (
              <p className="text-center text-zinc-500 py-10">No sellers yet.</p>
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
                    className="text-red-400 hover:text-red-300 text-xs mt-3"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}

            {products.length === 0 && (
              <p className="text-center text-zinc-500 py-10 col-span-full">No products yet.</p>
            )}
          </div>
        )}
      </div>
    </main>
  );
}