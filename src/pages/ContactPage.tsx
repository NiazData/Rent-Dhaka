import { type FormEvent, useState } from "react";
import { Mail } from "lucide-react";
import { OfficeMap } from "../components/OfficeMap";
import { submitContactMessage } from "../lib/netlify-forms";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";

const EMAIL = "Shamim2005@gmail.com";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    try {
      await submitContactMessage({ name, email, message });
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

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

      <section className="mt-10 max-w-md">
        <h2 className="text-xl font-semibold text-stone-900">Send a Message</h2>
        <p className="mt-1 text-sm text-stone-600">
          Prefer not to open your email app? Send your message here instead — we'll get it at{" "}
          {EMAIL}.
        </p>
        {status === "success" ? (
          <p role="status" className="mt-4 text-stone-700">
            Thanks! Your message has been sent — we'll get back to you soon.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 space-y-3">
            <div>
              <Label htmlFor="contact-name">Name</Label>
              <Input
                id="contact-name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="contact-email">Email</Label>
              <Input
                id="contact-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="contact-message">Message</Label>
              <Textarea
                id="contact-message"
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>
            {status === "error" && (
              <p role="alert" className="text-sm text-red-600">
                Something went wrong sending your message. Please try again.
              </p>
            )}
            <Button type="submit" disabled={status === "submitting"} className="w-full sm:w-auto">
              {status === "submitting" ? "Sending..." : "Send Message"}
            </Button>
          </form>
        )}
      </section>

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
