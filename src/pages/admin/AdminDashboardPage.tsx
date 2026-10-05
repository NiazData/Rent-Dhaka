import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BarChart3, Building2, Home as HomeIcon, Pencil, Plus, Tag, Trash2 } from "lucide-react";
import { createListing, deleteListing, getListings, updateListing } from "../../lib/listings-repository";
import { supabase } from "../../lib/supabase";
import { formatBDT } from "../../lib/format";
import { ListingFormModal } from "../../components/admin/ListingFormModal";
import { Button } from "../../components/ui/button";
import type { Listing, ListingInput, ListingPurpose } from "../../types";

const PURPOSE_BADGE: Record<ListingPurpose, string> = {
  rent: "bg-emerald-100 text-emerald-800",
  sale: "bg-sky-100 text-sky-800",
  builder: "bg-violet-100 text-violet-800",
};

type Tab = "overview" | "listings";

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [modalListing, setModalListing] = useState<Listing | null | undefined>(undefined);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function refresh() {
    setLoading(true);
    setListings(await getListings());
    setLoading(false);
  }

  useEffect(() => {
    refresh();
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate("/admin/login");
  }

  async function handleSave(input: ListingInput) {
    if (modalListing) {
      await updateListing(modalListing.id, input);
    } else {
      await createListing(input);
    }
    setModalListing(undefined);
    await refresh();
  }

  async function handleDelete(id: string, title: string) {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;

    setError(null);
    setDeletingId(id);
    try {
      await deleteListing(id);
      await refresh();
    } catch {
      setError("Failed to delete listing. Please try again.");
    }
    setDeletingId(null);
  }

  const stats = [
    { name: "Total Listings", value: listings.length, icon: BarChart3 },
    { name: "For Rent", value: listings.filter((l) => l.listingPurpose === "rent").length, icon: HomeIcon },
    { name: "For Sale", value: listings.filter((l) => l.listingPurpose === "sale").length, icon: Tag },
    { name: "By Builder", value: listings.filter((l) => l.listingPurpose === "builder").length, icon: Building2 },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {modalListing !== undefined && (
        <ListingFormModal listing={modalListing} onClose={() => setModalListing(undefined)} onSaved={handleSave} />
      )}

      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-stone-900">Admin Dashboard</h1>
          <p className="mt-2 text-stone-600">Manage your listings</p>
        </div>
        <Button type="button" variant="outline" size="sm" onClick={handleLogout}>
          Log Out
        </Button>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-stone-600">{stat.name}</p>
                  <p className="text-2xl font-bold text-stone-900">{stat.value}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent-100">
                  <Icon className="h-6 w-6 text-accent-600" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="rounded-lg border border-stone-200 bg-white shadow-sm">
        <div className="border-b border-stone-200">
          <nav className="flex gap-8 px-6">
            {(["overview", "listings"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`border-b-2 py-4 text-sm font-medium capitalize transition-colors ${
                  activeTab === tab
                    ? "border-accent-600 text-accent-700"
                    : "border-transparent text-stone-500 hover:text-stone-700"
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {error && (
            <p role="alert" className="mb-4 text-sm text-red-600">
              {error}
            </p>
          )}

          {loading ? (
            <div role="status" className="space-y-3">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-16 animate-pulse rounded-lg bg-stone-100" />
              ))}
            </div>
          ) : activeTab === "overview" ? (
            <div>
              <h3 className="mb-4 text-lg font-medium text-stone-900">Recent Listings</h3>
              <div className="space-y-3">
                {listings.slice(0, 5).map((listing) => (
                  <div key={listing.id} className="flex items-center justify-between rounded-lg bg-stone-50 p-4">
                    <div>
                      <p className="font-medium text-stone-900">{listing.title}</p>
                      <p className="text-sm text-stone-600">
                        {listing.slug} · {formatBDT(listing.rentBDT)}
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${PURPOSE_BADGE[listing.listingPurpose]}`}
                    >
                      {listing.listingPurpose}
                    </span>
                  </div>
                ))}
                {listings.length === 0 && <p className="py-8 text-center text-stone-500">No listings yet.</p>}
              </div>
            </div>
          ) : (
            <div>
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-lg font-medium text-stone-900">Listings ({listings.length})</h3>
                <Button type="button" size="sm" onClick={() => setModalListing(null)}>
                  <Plus className="mr-1.5 h-4 w-4" />
                  Add Listing
                </Button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-stone-200">
                      <th className="px-4 py-3 text-left font-medium text-stone-600">Listing</th>
                      <th className="px-4 py-3 text-left font-medium text-stone-600">Purpose</th>
                      <th className="px-4 py-3 text-right font-medium text-stone-600">Price</th>
                      <th className="px-4 py-3 text-right font-medium text-stone-600">Beds / Baths</th>
                      <th className="px-4 py-3 text-right font-medium text-stone-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {listings.map((listing) => (
                      <tr key={listing.id} className="border-b border-stone-100 hover:bg-stone-50">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            {listing.photos[0] ? (
                              <img
                                src={listing.photos[0]}
                                alt=""
                                className="h-10 w-10 flex-shrink-0 rounded-lg object-cover"
                              />
                            ) : (
                              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-stone-100 text-stone-400">
                                <HomeIcon className="h-5 w-5" />
                              </div>
                            )}
                            <div>
                              <p className="font-medium text-stone-900">{listing.title}</p>
                              <p className="text-xs text-stone-500">{listing.slug}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${PURPOSE_BADGE[listing.listingPurpose]}`}
                          >
                            {listing.listingPurpose}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right font-medium text-stone-900">
                          {formatBDT(listing.rentBDT)}
                        </td>
                        <td className="px-4 py-3 text-right text-stone-600">
                          {listing.beds} / {listing.baths}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              aria-label={`Edit ${listing.title}`}
                              onClick={() => setModalListing(listing)}
                              className="rounded-lg p-1.5 text-stone-500 transition-colors hover:bg-accent-50 hover:text-accent-600"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              aria-label={`Delete ${listing.title}`}
                              onClick={() => handleDelete(listing.id, listing.title)}
                              disabled={deletingId === listing.id}
                              className="rounded-lg p-1.5 text-stone-500 transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {listings.length === 0 && (
                  <p className="py-8 text-center text-stone-500">No listings yet. Add your first listing!</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
