import { useEffect, useState } from "react";
import { CONNECT_BUILDERS_PREFIX, SITE_IMAGES_BUCKET, supabase } from "../lib/supabase";

export function ConnectBuildersGallery() {
  const [urls, setUrls] = useState<string[]>([]);

  useEffect(() => {
    let active = true;

    supabase.storage
      .from(SITE_IMAGES_BUCKET)
      .list(CONNECT_BUILDERS_PREFIX)
      .then(({ data }) => {
        if (!active || !data) return;
        setUrls(
          data
            .filter((file) => file.name !== ".emptyFolderPlaceholder")
            .map(
              (file) =>
                supabase.storage
                  .from(SITE_IMAGES_BUCKET)
                  .getPublicUrl(`${CONNECT_BUILDERS_PREFIX}/${file.name}`).data.publicUrl
            )
        );
      });

    return () => {
      active = false;
    };
  }, []);

  if (urls.length === 0) {
    return null;
  }

  return (
    <div
      aria-label="Connect Builders gallery"
      className="mb-6 flex gap-3 overflow-x-auto rounded-lg bg-stone-50 p-3"
    >
      {urls.map((url) => (
        <img
          key={url}
          src={url}
          alt="Builder property"
          className="h-40 w-56 shrink-0 rounded-lg object-cover"
        />
      ))}
    </div>
  );
}
