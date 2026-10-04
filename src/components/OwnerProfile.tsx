import { useState } from "react";
import { Mail, MessageCircle, Phone, User } from "lucide-react";
import { OWNER_PHOTO_PATH, SITE_IMAGES_BUCKET, supabase } from "../lib/supabase";

const PHONE_NUMBER = "+8801970249432";
const WHATSAPP_DISPLAY = "+1 (530) 591-3113";
const WHATSAPP_NUMBER = "15305913113";
const EMAIL = "Shamim2005@gmail.com";

export function OwnerProfile() {
  const [photoFailed, setPhotoFailed] = useState(false);
  const { data } = supabase.storage.from(SITE_IMAGES_BUCKET).getPublicUrl(OWNER_PHOTO_PATH);

  return (
    <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:items-start sm:text-left">
      {photoFailed ? (
        <div
          aria-hidden="true"
          className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-stone-100 text-stone-400"
        >
          <User className="h-10 w-10" />
        </div>
      ) : (
        <img
          src={data.publicUrl}
          alt="Shamim Hassan"
          onError={() => setPhotoFailed(true)}
          className="h-24 w-24 shrink-0 rounded-full object-cover"
        />
      )}
      <div>
        <p className="font-semibold text-stone-900">Shamim Hassan</p>
        <p className="text-sm text-stone-600">Owner, Rent Dhaka</p>
        <p className="mt-2 text-sm text-stone-600">
          Mohammadpur
          <br />
          Dhaka-1207
          <br />
          Bangladesh
        </p>
        <div className="mt-3 flex flex-col gap-1 text-sm">
          <a
            href={`tel:${PHONE_NUMBER}`}
            className="flex items-center gap-2 text-accent-600 hover:underline"
          >
            <Phone className="h-4 w-4" /> {PHONE_NUMBER}
          </a>
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            className="flex items-center gap-2 text-accent-600 hover:underline"
          >
            <MessageCircle className="h-4 w-4" /> {WHATSAPP_DISPLAY} (WhatsApp)
          </a>
          <a
            href={`mailto:${EMAIL}`}
            className="flex items-center gap-2 text-accent-600 hover:underline"
          >
            <Mail className="h-4 w-4" /> {EMAIL}
          </a>
        </div>
        {photoFailed && (
          <p className="mt-3 text-xs text-stone-400">Photo coming soon — uploaded by admin.</p>
        )}
      </div>
    </div>
  );
}
