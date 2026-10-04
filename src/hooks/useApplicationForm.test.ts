import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useApplicationForm } from "./useApplicationForm";

describe("useApplicationForm", () => {
  it("starts on the personal step and blocks advancing until required fields are valid", () => {
    const { result } = renderHook(() => useApplicationForm());

    expect(result.current.step).toBe("personal");
    expect(result.current.canGoNext).toBe(false);

    act(() => {
      result.current.updatePersonal({
        fullName: "Rafiq Ahmed",
        email: "rafiq@example.com",
        phone: "01711000000",
      });
    });

    expect(result.current.canGoNext).toBe(true);
  });

  it("advances through all steps in order and accumulates data", () => {
    const { result } = renderHook(() => useApplicationForm());

    act(() => {
      result.current.updatePersonal({
        fullName: "Rafiq Ahmed",
        email: "rafiq@example.com",
        phone: "01711000000",
      });
    });
    act(() => result.current.goNext());
    expect(result.current.step).toBe("employment");

    act(() => {
      result.current.updateEmployment({ employer: "ACME Corp", position: "Engineer", monthlyIncomeBDT: 80000 });
    });
    act(() => result.current.goNext());
    expect(result.current.step).toBe("history");

    act(() => {
      result.current.updateHistory({
        previousAddress: "House 1, Road 2, Dhanmondi",
        previousLandlordContact: "",
      });
    });
    act(() => result.current.goNext());
    expect(result.current.step).toBe("documents");

    act(() => {
      result.current.updateDocuments({
        nidFile: new File(["id"], "nid.png", { type: "image/png" }),
        incomeProofFile: null,
      });
    });
    act(() => result.current.goNext());
    expect(result.current.step).toBe("review");
    expect(result.current.isLastStep).toBe(true);
    expect(result.current.data.personal.fullName).toBe("Rafiq Ahmed");
    expect(result.current.data.employment.monthlyIncomeBDT).toBe(80000);
  });

  it("does not advance past the current step when required fields are missing", () => {
    const { result } = renderHook(() => useApplicationForm());

    act(() => result.current.goNext());

    expect(result.current.step).toBe("personal");
  });

  it("goes back a step", () => {
    const { result } = renderHook(() => useApplicationForm());

    act(() => {
      result.current.updatePersonal({
        fullName: "Rafiq Ahmed",
        email: "rafiq@example.com",
        phone: "01711000000",
      });
    });
    act(() => result.current.goNext());
    expect(result.current.step).toBe("employment");

    act(() => result.current.goBack());
    expect(result.current.step).toBe("personal");
  });
});
