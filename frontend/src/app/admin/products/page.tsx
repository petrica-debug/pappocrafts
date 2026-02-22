"use client";

import { useState } from "react";
import Image from "next/image";
import { products as initialProducts, categories, type Product } from "@/lib/products";

export default function AdminProducts() {
  const [productList, setProductList] = useState<Product[]>(initialProducts);
  const [editing, setEditing] = useState<Product | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("All");

  const filtered = productList.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.artisan.toLowerCase().includes(search.toLowerCase());
    const matchCat = catFilter === "All" || p.category === catFilter;
    return matchSearch && matchCat;
  });

  function openNew() {
    setEditing({
      id: `product-${Date.now()}`,
      name: "", description: "", longDescription: "", price: 0, currency: "EUR",
      category: categories[1], artisan: "", country: "",
      image: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=600&h=600&fit=crop",
      tags: [], inStock: true,
    });
    setIsNew(true);
  }

  function saveProduct() {
    if (!editing || !editing.name.trim()) return;
    if (isNew) {
      setProductList((prev) => [editing, ...prev]);
    } else {
      setProductList((prev) => prev.map((p) => (p.id === editing.id ? editing : p)));
    }
    setEditing(null);
    setIsNew(false);
  }

  function deleteProduct(id: string) {
    setProductList((prev) => prev.filter((p) => p.id !== id));
    if (editing?.id === id) { setEditing(null); setIsNew(false); }
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Products</h1>
          <p className="text-sm text-white/40 mt-1">{productList.length} products</p>
        </div>
        <button onClick={openNew} className="mt-3 sm:mt-0 rounded-lg bg-[#4A9B3F] px-4 py-2 text-sm font-semibold text-white hover:bg-[#3D8234] transition-colors">
          + Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text" value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products..."
          className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3.5 py-2 text-sm text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-[#4A9B3F]/50"
        />
        <select
          value={catFilter} onChange={(e) => setCatFilter(e.target.value)}
          className="rounded-lg border border-white/10 bg-white/5 text-white text-sm px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#4A9B3F]"
        >
          {categories.map((c) => <option key={c} value={c} className="bg-[#1A1D27]">{c}</option>)}
        </select>
      </div>

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => { setEditing(null); setIsNew(false); }}>
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-xl bg-[#1A1D27] border border-white/10 p-6" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-white mb-4">{isNew ? "Add Product" : "Edit Product"}</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-white/40 mb-1">Name *</label>
                <input value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#4A9B3F]" />
              </div>
              <div>
                <label className="block text-xs text-white/40 mb-1">Description</label>
                <textarea value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} rows={2} className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#4A9B3F] resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-white/40 mb-1">Price (EUR)</label>
                  <input type="number" min={0} step={0.01} value={editing.price} onChange={(e) => setEditing({ ...editing, price: Number(e.target.value) })} className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#4A9B3F]" />
                </div>
                <div>
                  <label className="block text-xs text-white/40 mb-1">Category</label>
                  <select value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value })} className="w-full rounded-lg border border-white/10 bg-white/5 text-white text-sm px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#4A9B3F]">
                    {categories.filter((c) => c !== "All").map((c) => <option key={c} value={c} className="bg-[#1A1D27]">{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-white/40 mb-1">Artisan</label>
                  <input value={editing.artisan} onChange={(e) => setEditing({ ...editing, artisan: e.target.value })} className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#4A9B3F]" />
                </div>
                <div>
                  <label className="block text-xs text-white/40 mb-1">Country</label>
                  <input value={editing.country} onChange={(e) => setEditing({ ...editing, country: e.target.value })} className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#4A9B3F]" />
                </div>
              </div>
              <div>
                <label className="block text-xs text-white/40 mb-1">Image URL</label>
                <input value={editing.image} onChange={(e) => setEditing({ ...editing, image: e.target.value })} className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#4A9B3F]" />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={editing.inStock} onChange={(e) => setEditing({ ...editing, inStock: e.target.checked })} className="accent-[#4A9B3F]" />
                <label className="text-xs text-white/60">In Stock</label>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={saveProduct} className="flex-1 rounded-lg bg-[#4A9B3F] py-2 text-sm font-semibold text-white hover:bg-[#3D8234]">Save</button>
              <button onClick={() => { setEditing(null); setIsNew(false); }} className="flex-1 rounded-lg bg-white/5 py-2 text-sm text-white/60 hover:bg-white/10">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Products Grid */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((product) => (
          <div key={product.id} className="rounded-xl bg-[#1A1D27] border border-white/5 overflow-hidden group">
            <div className="relative h-32 bg-white/5">
              <Image src={product.image} alt={product.name} fill className="object-cover" sizes="300px" />
              {!product.inStock && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="text-xs font-bold text-red-400">OUT OF STOCK</span>
                </div>
              )}
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold text-white truncate">{product.name}</h3>
                  <p className="text-xs text-white/30 mt-0.5">{product.artisan} &middot; {product.country}</p>
                </div>
                <span className="text-sm font-bold text-[#4A9B3F] shrink-0">&euro;{product.price.toFixed(2)}</span>
              </div>
              <p className="text-xs text-white/20 mt-1">{product.category}</p>
              <div className="flex gap-2 mt-3">
                <button onClick={() => { setEditing(product); setIsNew(false); }} className="flex-1 rounded-lg bg-white/5 py-1.5 text-xs text-white/60 hover:bg-white/10 transition-colors">Edit</button>
                <button onClick={() => deleteProduct(product.id)} className="rounded-lg bg-red-500/10 px-3 py-1.5 text-xs text-red-400 hover:bg-red-500/20 transition-colors">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
