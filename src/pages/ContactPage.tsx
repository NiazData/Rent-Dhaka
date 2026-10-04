import { Mail } from "lucide-react";
import { OfficeMap } from "../components/OfficeMap";

const EMAIL = "Shamim2005@gmail.com";

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-3xl font-bold text-stone-900">Contact Us</h1>
      <p className="mt-3 text-stone-600">
        Reach our Mohammadpur office directly or email us for the fastest response.
      </p>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <a
          href={`mailto:${EMAIL}`}
          className="flex items-center gap-2 rounded-md bg-accent-600 px-4 py-2 text-sm font-medium text-white"
        >
          <Mail className="h-4 w-4" /> {EMAIL}
        </a>
      </div>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-stone-900">Our Office</h2>
        <p className="mt-2 text-stone-600">
          Mohammadpur
          <br />
          Dhaka-1207
          <br />
          Bangladesh
        </p>
        <div className="mt-4">
          <OfficeMap />
        </div>
      </section>
    </div>
  );
}
