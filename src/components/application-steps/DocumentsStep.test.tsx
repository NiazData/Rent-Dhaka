import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { DocumentsStep } from "./DocumentsStep";

function makeFile(name: string, sizeBytes: number, type = "image/jpeg") {
  const file = new File(["x"], name, { type });
  Object.defineProperty(file, "size", { value: sizeBytes });
  return file;
}

const emptyDocs = { nidFile: null, incomeProofFile: null };

describe("DocumentsStep", () => {
  it("restricts both file inputs to images and PDFs", () => {
    render(<DocumentsStep data={emptyDocs} onChange={vi.fn()} />);

    expect(screen.getByLabelText(/national id/i)).toHaveAttribute("accept", "image/*,application/pdf");
    expect(screen.getByLabelText(/income proof/i)).toHaveAttribute(
      "accept",
      "image/*,application/pdf"
    );
  });

  it("accepts a file within the size limit", () => {
    const onChange = vi.fn();
    render(<DocumentsStep data={emptyDocs} onChange={onChange} />);

    const file = makeFile("nid.jpg", 1 * 1024 * 1024);
    fireEvent.change(screen.getByLabelText(/national id/i), { target: { files: [file] } });

    expect(onChange).toHaveBeenCalledWith({ nidFile: file });
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("rejects an oversized National ID file with an inline error and does not call onChange", () => {
    const onChange = vi.fn();
    render(<DocumentsStep data={emptyDocs} onChange={onChange} />);

    const input = screen.getByLabelText(/national id/i);
    fireEvent.change(input, { target: { files: [makeFile("huge.jpg", 6 * 1024 * 1024)] } });

    expect(screen.getByRole("alert")).toHaveTextContent(/file is too large.*under 3mb/i);
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(onChange).not.toHaveBeenCalled();
  });

  it("rejects an oversized income proof file and clears the error after a valid pick", () => {
    const onChange = vi.fn();
    render(<DocumentsStep data={emptyDocs} onChange={onChange} />);

    const input = screen.getByLabelText(/income proof/i);
    fireEvent.change(input, { target: { files: [makeFile("payslip.pdf", 5 * 1024 * 1024, "application/pdf")] } });
    expect(screen.getByRole("alert")).toHaveTextContent(/file is too large/i);
    expect(onChange).not.toHaveBeenCalled();

    const ok = makeFile("payslip-small.pdf", 500 * 1024, "application/pdf");
    fireEvent.change(input, { target: { files: [ok] } });
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(onChange).toHaveBeenCalledWith({ incomeProofFile: ok });
  });
});
