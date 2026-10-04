import { act, renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useSession } from "./useSession";
import { supabase } from "../lib/supabase";

vi.mock("../lib/supabase", () => ({
  supabase: {
    auth: {
      getSession: vi.fn(),
      onAuthStateChange: vi.fn(() => ({ data: { subscription: { unsubscribe: vi.fn() } } })),
    },
  },
}));

describe("useSession", () => {
  it("starts loading, then resolves with the current session", async () => {
    const fakeSession = { user: { id: "u1" } };
    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: { session: fakeSession },
    } as never);

    const { result } = renderHook(() => useSession());

    expect(result.current.loading).toBe(true);

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.session).toEqual(fakeSession);
  });

  it("resolves with a null session when signed out", async () => {
    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: { session: null },
    } as never);

    const { result } = renderHook(() => useSession());

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.session).toBeNull();
  });

  it("updates the session when the auth state changes", async () => {
    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: { session: null },
    } as never);

    let capturedCallback: ((event: string, session: unknown) => void) | undefined;
    vi.mocked(supabase.auth.onAuthStateChange).mockImplementation((callback) => {
      capturedCallback = callback as never;
      return { data: { subscription: { unsubscribe: vi.fn() } } } as never;
    });

    const { result } = renderHook(() => useSession());
    await waitFor(() => expect(result.current.loading).toBe(false));

    const newSession = { user: { id: "u2" } };
    act(() => {
      capturedCallback?.("SIGNED_IN", newSession);
    });

    await waitFor(() => expect(result.current.session).toEqual(newSession));
  });
});
