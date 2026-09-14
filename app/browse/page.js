"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "../components/Navbar";
import carData from "../data/carData";
import { supabase } from "../lib/supabaseClient";

export default function BrowsePage() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  const [brandFilter, setBrandFilter] = useState(initialQuery);
  const [modelFilter, setModelFilter] = useState("");
  const [fuelFilter, setFuelFilter] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  useEffect(() => {
    loadCars();
  }, []);

  async function loadCars() {
    setLoading(true);
    const { data, error } = await supabase
      .from("submissions")
      .select("*")
      .eq("is_public", true)
      .order("created_at", { ascending: false });

    if (!error) {
      setCars(data);
    }
    setLoading(false);
  }

  function handleBrandChange(e) {
    setBrandFilter(e.target.value);
    setModelFilter("");
  }

  const brandList = Object.keys(carData);
  const modelList = brandFilter ? carData[brandFilter] || [] : [];

  const filteredCars = cars.filter((car) => {
    if (brandFilter && car.brand !== brandFilter) return false;
    if (modelFilter && car.model !== modelFilter) return false;
    if (fuelFilter && car.fuel_type !== fuelFilter) return false;
    if (maxPrice && Number(car.price) > Number(maxPrice)) return false;
    return true;
  });

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-brand-bg text-brand-text px-6 py-16">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-2">
          Browse Cars
        </h1>
        <p className="text-brand-muted text-center mb-10">
          Find the right car for you
        </p>

        <div className="max-w-4xl mx-auto bg-brand-card rounded-2xl p-6 mb-10 flex flex-col sm:flex-row gap-4">
          <select
            value={brandFilter}
            onChange={handleBrandChange}
            className="bg-brand-bg border border-zinc-700 rounded-lg px-4 py-2 outline-none focus:border-white flex-1"
          >
            <option value="">All Brands</option>
            {brandList.map((brand) => (
              <option key={brand} value={brand}>{brand}</option>
            ))}
          </select>

          <select
            value={modelFilter}
            onChange={(e) => setModelFilter(e.target.value)}
            disabled={!brandFilter}
            className="bg-brand-bg border border-zinc-700 rounded-lg px-4 py-2 outline-none focus:border-white flex-1 disabled:opacity-50"
          >
            <option value="">All Models</option>
            {modelList.map((model) => (
              <option key={model} value={model}>{model}</option>
            ))}
          </select>

          <select
            value={fuelFilter}
            onChange={(e) => setFuelFilter(e.target.value)}
            className="bg-brand-bg border border-zinc-700 rounded-lg px-4 py-2 outline-none focus:border-white flex-1"
          >
            <option value="">All Fuel Types</option>
            <option value="Petrol">Petrol</option>
            <option value="Diesel">Diesel</option>
            <option value="Electric">Electric</option>
            <option value="Hybrid">Hybrid</option>
          </select>

          <input
            type="number"
            placeholder="Max Price (EGP)"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="bg-brand-bg border border-zinc-700 rounded-lg px-4 py-2 outline-none focus:border-white flex-1"
          />
        </div>

        {loading ? (
          <p className="text-center text-brand-muted">Loading cars...</p>
        ) : (
          <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredCars.map((car) => (
              <div key={car.id} className="bg-brand-card rounded-2xl overflow-hidden">
                {car.photo_urls && (
                  <img
                    src={car.photo_urls.split(", ")[0]}
                    alt={`${car.brand} ${car.model}`}
                    className="w-full h-40 object-cover"
                  />
                )}
                <div className="p-4">
                  <h3 className="font-semibold text-lg">
                    {car.brand} {car.model}
                  </h3>
                  <p className="text-brand-muted text-sm mb-2">
                    {car.year} • {car.mileage} km • {car.fuel_type}
                  </p>
                  <p className="text-lg font-bold">
                    {Number(car.price).toLocaleString()} EGP
                  </p>
                  <p className="text-brand-muted text-xs mt-1">{car.location}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && filteredCars.length === 0 && (
          <p className="text-center text-zinc-500 mt-10">
            No cars match your search right now.
          </p>
        )}
      </main>
    </>
  );
}