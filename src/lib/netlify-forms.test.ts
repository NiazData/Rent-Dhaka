import { beforeEach, describe, expect, it, vi } from "vitest";
import { submitTourRequest } from "./netlify-forms";

describe("submitTourRequest", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("POSTs url-encoded form data including the form-name field", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal("fetch", fetchMock);

    await submitTourRequest({
      listingSlug: "gulshan-2-modern-apartment",
      name: "Rafiq Ahmed",
      phone: "01711000000",
      email: "rafiq@example.com",
      preferredDate: "2026-11-05",
      message: "Interested in a weekend tour",
    });

    expect(fetchMock).toHaveBeenCalledWith("/", expect.objectContaining({ method: "POST" }));
    const body = fetchMock.mock.calls[0][1].body as string;
    const params = new URLSearchParams(body);
    expect(params.get("form-name")).toBe("tour-request");
    expect(params.get("listingSlug")).toBe("gulshan-2-modern-apartment");
    expect(params.get("name")).toBe("Rafiq Ahmed");
  });

  it("throws when the response is not ok", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false }));

    await expect(
      submitTourRequest({
        listingSlug: "gulshan-2-modern-apartment",
        name: "Rafiq Ahmed",
        phone: "01711000000",
        email: "rafiq@example.com",
        preferredDate: "2026-11-05",
        message: "",
      })
    ).rejects.toThrow("Tour request submission failed");
  });
});
