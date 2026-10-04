import { type ChangeEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CONNECT_BUILDERS_PREFIX,
  OWNER_PHOTO_PATH,
  SITE_IMAGES_BUCKET,
  supabase,
} from "../../lib/supabase";
import { Button } from "../../components/ui/button";

function getOwnerPhotoUrl(version: number): string {
  const { data } = supabase.storage.from(SITE_IMAGES_BUCKET).getPublicUrl(OWNER_PHOTO_PATH);
  return `${data.publicUrl}?v=${version}`;
}

function OwnerPhotoSection() {
  const [version, setVersion] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    const { error: uploadError } = await supabase.storage
      .from(SITE_IMAGES_BUCKET)
      .upload(OWNER_PHOTO_PATH, file, { upsert: true });

    setUploading(false);
    if (uploadError) {
      setError("Upload failed. Please try again.");
      return;
    }
    setVersion((v) => v + 1);
  }

  return (
    <section>
      <h2 className="text-lg font-semibold text-stone-900">Owner Photo</h2>
      <p className="mt-1 text-sm text-stone-600">
        Shown on the About page in place of the "Photo coming soon" placeholder.
      </p>
      <img
        src={getOwnerPhotoUrl(version)}
        alt="Current owner photo"
        className="mt-3 h-24 w-24 rounded-full border border-stone-200 object-cover"
        onError={(e) => {
          e.currentTarget.style.visibility = "hidden";
        }}
      />
      <div className="mt-3">
        <label htmlFor="owner-photo-upload" className="text-sm font-medium text-stone-700">
          Replace photo
        </label>
        <input
          id="owner-photo-upload"
          type="file"
          accept="image/*"
          disabled={uploading}
          onChange={handleFileChange}
          className="mt-1 block text-sm"
        />
      </div>
      {error && (
        <p role="alert" className="mt-2 text-sm text-red-600">
          {error}
        </p>
      )}
    </section>
  );
}

interface GalleryFile {
  name: string;
  url: string;
}

function ConnectBuildersGallerySection() {
  const [files, setFiles] = useState<GalleryFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function refresh() {
    setLoading(true);
    setError(null);

    const { data, error: listError } = await supabase.storage
      .from(SITE_IMAGES_BUCKET)
      .list(CONNECT_BUILDERS_PREFIX);

    setLoading(false);
    if (listError || !data) {
      setError("Failed to load gallery.");
      return;
    }

    setFiles(
      data
        .filter((file) => file.name !== ".emptyFolderPlaceholder")
        .map((file) => ({
          name: file.name,
          url: supabase.storage
            .from(SITE_IMAGES_BUCKET)
            .getPublicUrl(`${CONNECT_BUILDERS_PREFIX}/${file.name}`).data.publicUrl,
        }))
    );
  }

  useEffect(() => {
    refresh();
  }, []);

  async function handleUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);
    const { error: uploadError } = await supabase.storage
      .from(SITE_IMAGES_BUCKET)
      .upload(`${CONNECT_BUILDERS_PREFIX}/${Date.now()}-${file.name}`, file);

    if (uploadError) {
      setError("Upload failed. Please try again.");
      return;
    }
    await refresh();
  }

  async function handleDelete(name: string) {
    setError(null);
    const { error: deleteError } = await supabase.storage
      .from(SITE_IMAGES_BUCKET)
      .remove([`${CONNECT_BUILDERS_PREFIX}/${name}`]);

    if (deleteError) {
      setError("Delete failed. Please try again.");
      return;
    }
    await refresh();
  }

  return (
    <section className="mt-10">
      <h2 className="text-lg font-semibold text-stone-900">Connect Builders Gallery</h2>
      <p className="mt-1 text-sm text-stone-600">
        Shown at the top of the Connect Builders listings page.
      </p>

      {loading ? (
        <p className="mt-3 text-sm text-stone-600">Loading…</p>
      ) : files.length === 0 ? (
        <p className="mt-3 text-sm text-stone-600">No images yet.</p>
      ) : (
        <ul className="mt-3 flex flex-wrap gap-3">
          {files.map((file) => (
            <li key={file.name} className="relative">
              <img
                src={file.url}
                alt={file.name}
                className="h-24 w-32 rounded-md border border-stone-200 object-cover"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-1 w-full"
                onClick={() => handleDelete(file.name)}
              >
                Delete
              </Button>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-4">
        <label htmlFor="gallery-upload" className="text-sm font-medium text-stone-700">
          Add a new image
        </label>
        <input
          id="gallery-upload"
          type="file"
          accept="image/*"
          onChange={handleUpload}
          className="mt-1 block text-sm"
        />
      </div>
      {error && (
        <p role="alert" className="mt-2 text-sm text-red-600">
          {error}
        </p>
      )}
    </section>
  );
}

export default function AdminDashboardPage() {
  const navigate = useNavigate();

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate("/admin/login");
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-stone-900">Admin Dashboard</h1>
        <Button type="button" variant="outline" size="sm" onClick={handleLogout}>
          Log Out
        </Button>
      </div>

      <div className="mt-8">
        <OwnerPhotoSection />
      </div>
      <ConnectBuildersGallerySection />
    </div>
  );
}
