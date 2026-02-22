"use client";

import { useState } from "react";
import Image from "next/image";
import { serviceProviders, serviceCategories, type ServiceProvider } from "@/lib/services";

export default function AdminServices() {
  const [providerList, setProviderList] = useState<ServiceProvider[]>(serviceProviders);
  const [editing, setEditing] = useState<ServiceProvider | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("All");

  const filtered = providerList.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.title.toLowerCase().includes(search.toLowerCase());
    const matchCat = catFilter === "All" || p.category === catFilter;
    return matchSearch && matchCat;
  });

  function openNew() {
    setEditing({
      id: `service-${Date.now()}`, name: "", title: "", description: "", longDescription: "",
      category: serviceCategories[1].name, hourlyRate: 0, fixedRateFrom: null, currency: "EUR",
      rating: 5, reviewCount: 0, location: "", country: "",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&h=300&fit=crop",
      badges: [], available: true, responseTime: "< 1 hour", completedJobs: 0,
    });
    setIsNew(true);
  }

  function saveProvider() {
    if (!editing || !editing.name.trim()) return;
    if (isNew) {
      setProviderList((prev) => [editing, ...prev]);
    } else {
      setProviderList((prev) => prev.map((p) => (p.id === editing.id ? editing : p)));
    }
    setEditing(null);
    setIsNew(false);
  }

  function deleteProvider(id: string) {
    setProviderList((prev) => prev.filter((p) => p.id !== id));
    if (editing?.id === id) { setEditing(null); setIsNew(false); }
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Services</h1>
          <p className="text-sm text-white/40 mt-1">{providerList.length} service providers</p>
        </div>
        <button onClick={openNew} className="mt-3 sm:mt-0 rounded-lg bg-[#4A9B3F] px-4 py-2 text-sm font-semibold text-white hover:bg-[#3D8234] transition-colors">
          + Add Provider
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text" value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Search providers..."
          className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3.5 py-2 text-sm text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-[#4A9B3F]/50"
        />
        <select
          value={catFilter} onChange={(e) => setCatFilter(e.target.value)}
          className="rounded-lg border border-white/10 bg-white/5 text-white text-sm px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#4A9B3F]"
        >
          {serviceCategories.map((c) => <option key={c.name} value={c.name} className="bg-[#1A1D27]">{c.name}</option>)}
        </select>
      </div>

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => { setEditing(null); setIsNew(false); }}>
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-xl bg-[#1A1D27] border border-white/10 p-6" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-white mb-4">{isNew ? "Add Service Provider" : "Edit Provider"}</h2>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-white/40 mb-1">Name *</label>
                  <input value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#4A9B3F]" />
                </div>
                <div>
                  <label className="block text-xs text-white/40 mb-1">Title</label>
                  <input value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#4A9B3F]" placeholder="e.g. Master Electrician" />
                </div>
              </div>
              <div>
                <label className="block text-xs text-white/40 mb-1">Description</label>
                <textarea value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} rows={2} className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#4A9B3F] resize-none" />
              </div>
              <div>
                <label className="block text-xs text-white/40 mb-1">Category</label>
                <select value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value })} className="w-full rounded-lg border border-white/10 bg-white/5 text-white text-sm px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#4A9B3F]">
                  {serviceCategories.filter((c) => c.name !== "All").map((c) => <option key={c.name} value={c.name} className="bg-[#1A1D27]">{c.name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs text-white/40 mb-1">Hourly Rate (&euro;)</label>
                  <input type="number" min={0} step={0.5} value={editing.hourlyRate} onChange={(e) => setEditing({ ...editing, hourlyRate: Number(e.target.value) })} className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#4A9B3F]" />
                </div>
                <div>
                  <label className="block text-xs text-white/40 mb-1">Location</label>
                  <input value={editing.location} onChange={(e) => setEditing({ ...editing, location: e.target.value })} className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#4A9B3F]" />
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
                <input type="checkbox" checked={editing.available} onChange={(e) => setEditing({ ...editing, available: e.target.checked })} className="accent-[#4A9B3F]" />
                <label className="text-xs text-white/60">Available</label>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={saveProvider} className="flex-1 rounded-lg bg-[#4A9B3F] py-2 text-sm font-semibold text-white hover:bg-[#3D8234]">Save</button>
              <button onClick={() => { setEditing(null); setIsNew(false); }} className="flex-1 rounded-lg bg-white/5 py-2 text-sm text-white/60 hover:bg-white/10">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Providers List */}
      <div className="space-y-3">
        {filtered.map((provider) => (
          <div key={provider.id} className="rounded-xl bg-[#1A1D27] border border-white/5 p-4 flex gap-4 items-center">
            <div className="relative h-12 w-12 rounded-full overflow-hidden bg-white/5 flex-shrink-0">
              <Image src={provider.image} alt={provider.name} fill className="object-cover" sizes="48px" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-white truncate">{provider.name}</h3>
                {!provider.available && <span className="text-[10px] text-red-400 bg-red-500/10 rounded-full px-2 py-0.5">Unavailable</span>}
              </div>
              <p className="text-xs text-white/40 truncate">{provider.title} &middot; {provider.location}, {provider.country}</p>
              <p className="text-xs text-white/20">{provider.category} &middot; &euro;{provider.hourlyRate}/hr &middot; {provider.rating}/5 ({provider.reviewCount} reviews)</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => { setEditing(provider); setIsNew(false); }} className="rounded-lg bg-white/5 px-3 py-1.5 text-xs text-white/60 hover:bg-white/10">Edit</button>
              <button onClick={() => deleteProvider(provider.id)} className="rounded-lg bg-red-500/10 px-3 py-1.5 text-xs text-red-400 hover:bg-red-500/20">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
