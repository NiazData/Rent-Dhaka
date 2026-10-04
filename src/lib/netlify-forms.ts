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
