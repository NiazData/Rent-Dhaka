import { act, renderHook } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { INACTIVITY_TIMEOUT_MS, useInactivityLogout } from "./useInactivityLogout";

const { useSessionMock, signOutMock, navigateMock } = vi.hoisted(() => ({
  useSessionMock: vi.fn(),
  signOutMock: vi.fn().mockResolvedValue({ error: null }),
  navigateMock: vi.fn(),
}));

vi.mock("./useSession", () => ({ useSession: useSessionMock }));

vi.mock("../lib/supabase", () => ({
  SITE_IMAGES_BUCKET: "site-images",
  LISTINGS_TABLE: "listings",
  LISTING_PHOTOS_PREFIX: "listings",
  supabase: { auth: { signOut: signOutMock } },
}));

vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router-dom")>();
  return { ...actual, useNavigate: () => navigateMock };
});

describe("useInactivityLogout", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    navigateMock.mockClear();
    signOutMock.mockClear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("does nothing when there is no session", () => {
    useSessionMock.mockReturnValue({ session: null, loading: false });
    renderHook(() => useInactivityLogout(), { wrapper: MemoryRouter });

    vi.advanceTimersByTime(INACTIVITY_TIMEOUT_MS + 1000);

    expect(signOutMock).not.toHaveBeenCalled();
    expect(navigateMock).not.toHaveBeenCalled();
  });

  it("signs out and redirects to the login page after the timeout with no activity", async () => {
    useSessionMock.mockReturnValue({ session: { user: { id: "admin-1" } }, loading: false });
    renderHook(() => useInactivityLogout(), { wrapper: MemoryRouter });

    await act(async () => {
      vi.advanceTimersByTime(INACTIVITY_TIMEOUT_MS + 1000);
      await Promise.resolve();
    });

    expect(signOutMock).toHaveBeenCalled();
    expect(navigateMock).toHaveBeenCalledWith("/admin/login?reason=timeout");
  });

  it("resets the timer on mouse/keyboard activity so it doesn't log out early", () => {
    useSessionMock.mockReturnValue({ session: { user: { id: "admin-1" } }, loading: false });
    renderHook(() => useInactivityLogout(), { wrapper: MemoryRouter });

    vi.advanceTimersByTime(INACTIVITY_TIMEOUT_MS - 1000);
    act(() => {
      window.dispatchEvent(new Event("mousemove"));
    });
    vi.advanceTimersByTime(INACTIVITY_TIMEOUT_MS - 1000);

    expect(signOutMock).not.toHaveBeenCalled();
    expect(navigateMock).not.toHaveBeenCalled();
  });
});
