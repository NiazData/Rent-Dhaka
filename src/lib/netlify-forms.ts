import type { ApplicationData } from "../hooks/useApplicationForm";

export interface TourRequestFields {
  listingSlug: string;
  name: string;
  phone: string;
  email: string;
  preferredDate: string;
  message: string;
}

export async function submitTourRequest(fields: TourRequestFields): Promise<void> {
  const body = new URLSearchParams({ "form-name": "tour-request", ...fields }).toString();
  const response = await fetch("/", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  if (!response.ok) {
    throw new Error("Tour request submission failed");
  }
}

export interface ContactMessageFields {
  name: string;
  email: string;
  message: string;
}

export async function submitContactMessage(fields: ContactMessageFields): Promise<void> {
  const body = new URLSearchParams({ "form-name": "contact-message", ...fields }).toString();
  const response = await fetch("/", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  if (!response.ok) {
    throw new Error("Contact message submission failed");
  }
}

export type ApplicationSubmission = { listingSlug: string } & ApplicationData;

export async function submitApplication(submission: ApplicationSubmission): Promise<void> {
  const formData = new FormData();
  formData.append("form-name", "rental-application");
  formData.append("listingSlug", submission.listingSlug);
  formData.append("fullName", submission.personal.fullName);
  formData.append("email", submission.personal.email);
  formData.append("phone", submission.personal.phone);
  formData.append("employer", submission.employment.employer);
  formData.append("position", submission.employment.position);
  formData.append("monthlyIncomeBDT", String(submission.employment.monthlyIncomeBDT));
  formData.append("previousAddress", submission.history.previousAddress);
  formData.append("previousLandlordContact", submission.history.previousLandlordContact);
  if (submission.documents.nidFile) formData.append("nidFile", submission.documents.nidFile);
  if (submission.documents.incomeProofFile) {
    formData.append("incomeProofFile", submission.documents.incomeProofFile);
  }

  const response = await fetch("/", { method: "POST", body: formData });

  if (!response.ok) {
    throw new Error("Application submission failed");
  }
}
