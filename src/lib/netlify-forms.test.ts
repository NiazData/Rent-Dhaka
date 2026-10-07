import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  submitApplication,
  submitContactMessage,
  submitTourRequest,
  type ApplicationSubmission,
} from "./netlify-forms";

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

describe("submitContactMessage", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("POSTs url-encoded form data including the form-name field", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal("fetch", fetchMock);

    await submitContactMessage({
      name: "Rafiq Ahmed",
      email: "rafiq@example.com",
      message: "Is this apartment still available?",
    });

    expect(fetchMock).toHaveBeenCalledWith("/", expect.objectContaining({ method: "POST" }));
    const body = fetchMock.mock.calls[0][1].body as string;
    const params = new URLSearchParams(body);
    expect(params.get("form-name")).toBe("contact-message");
    expect(params.get("name")).toBe("Rafiq Ahmed");
    expect(params.get("email")).toBe("rafiq@example.com");
    expect(params.get("message")).toBe("Is this apartment still available?");
  });

  it("throws when the response is not ok", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false }));

    await expect(
      submitContactMessage({ name: "Rafiq Ahmed", email: "rafiq@example.com", message: "Hi" })
    ).rejects.toThrow("Contact message submission failed");
  });
});

describe("submitApplication", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  function sampleSubmission(): ApplicationSubmission {
    return {
      listingSlug: "gulshan-2-modern-apartment",
      personal: { fullName: "Rafiq Ahmed", email: "rafiq@example.com", phone: "01711000000" },
      employment: { employer: "ACME Corp", position: "Engineer", monthlyIncomeBDT: 80000 },
      history: { previousAddress: "House 1, Road 2, Dhanmondi", previousLandlordContact: "" },
      documents: {
        nidFile: new File(["id"], "nid.png", { type: "image/png" }),
        incomeProofFile: null,
      },
    };
  }

  it("POSTs multipart form data including the form-name field and the NID file", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal("fetch", fetchMock);

    await submitApplication(sampleSubmission());

    expect(fetchMock).toHaveBeenCalledWith("/", expect.objectContaining({ method: "POST" }));
    const body = fetchMock.mock.calls[0][1].body as FormData;
    expect(body.get("form-name")).toBe("rental-application");
    expect(body.get("fullName")).toBe("Rafiq Ahmed");
    expect(body.get("monthlyIncomeBDT")).toBe("80000");
    expect((body.get("nidFile") as File).name).toBe("nid.png");
  });

  it("throws when the response is not ok", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false }));

    await expect(submitApplication(sampleSubmission())).rejects.toThrow(
      "Application submission failed"
    );
  });
});
