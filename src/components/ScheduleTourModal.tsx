import { type FormEvent, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { submitTourRequest } from "../lib/netlify-forms";

interface ScheduleTourModalProps {
  listingSlug: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ScheduleTourModal({ listingSlug, open, onOpenChange }: ScheduleTourModalProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    try {
      await submitTourRequest({ listingSlug, name, phone, email, preferredDate, message });
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogTitle>Schedule a Tour</DialogTitle>
        {status === "success" ? (
          <p role="status" className="mt-4 text-stone-700">
            Thanks! We'll contact you to confirm your tour time.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 space-y-3">
            <div>
              <Label htmlFor="tour-name">Name</Label>
              <Input id="tour-name" required value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="tour-phone">Phone</Label>
              <Input id="tour-phone" required value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="tour-email">Email</Label>
              <Input
                id="tour-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="tour-date">Preferred date</Label>
              <Input
                id="tour-date"
                type="date"
                required
                value={preferredDate}
                onChange={(e) => setPreferredDate(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="tour-message">Message (optional)</Label>
              <Textarea id="tour-message" value={message} onChange={(e) => setMessage(e.target.value)} />
            </div>
            {status === "error" && (
              <p role="alert" className="text-sm text-red-600">
                Something went wrong sending your request. Please try again.
              </p>
            )}
            <Button type="submit" disabled={status === "submitting"} className="w-full">
              {status === "submitting" ? "Sending..." : "Request Tour"}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
