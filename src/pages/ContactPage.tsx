import { Mail, MessageCircle, Phone } from "lucide-react";
import { OfficeMap } from "../components/OfficeMap";

const PHONE_NUMBER = "+8801970249432";
const WHATSAPP_NUMBER = "8801970249432";
const EMAIL = "hello@rentdhaka.com";

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-3xl font-bold text-stone-900">Contact Us</h1>
      <p className="mt-3 text-stone-600">
        Reach our Mohammadpur office directly, or message us on WhatsApp for the fastest response.
      </p>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <a
          href={`tel:${PHONE_NUMBER}`}
          className="flex items-center gap-2 rounded-md bg-accent-600 px-4 py-2 text-sm font-medium text-white"
        >
          <Phone className="h-4 w-4" /> Call {PHONE_NUMBER}
        </a>
        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}`}
          className="flex items-center gap-2 rounded-md bg-stone-100 px-4 py-2 text-sm font-medium text-stone-900"
        >
          <MessageCircle className="h-4 w-4" /> WhatsApp Us
        </a>
        <a
          href={`mailto:${EMAIL}`}
          className="flex items-center gap-2 rounded-md border border-stone-300 px-4 py-2 text-sm font-medium text-stone-900"
        >
          <Mail className="h-4 w-4" /> {EMAIL}
        </a>
      </div>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-stone-900">Our Office</h2>
        <p className="mt-2 text-stone-600">Road 4, Mohammadpur, Dhaka 1207</p>
        <div className="mt-4">
          <OfficeMap />
        </div>
      </section>
    </div>
  );
}
