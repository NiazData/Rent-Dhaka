import { useState, type ChangeEvent } from "react";
import { Label } from "../ui/label";
import type { ApplicationData } from "../../hooks/useApplicationForm";

// 3MB per file keeps both uploads plus the text fields under Netlify Forms' ~8MB request cap.
const MAX_UPLOAD_BYTES = 3 * 1024 * 1024;
const ACCEPTED_TYPES = "image/*,application/pdf";
const TOO_LARGE_MESSAGE = "File is too large — please choose a file under 3MB.";

type FileField = "nidFile" | "incomeProofFile";

interface DocumentsStepProps {
  data: ApplicationData["documents"];
  onChange: (fields: Partial<ApplicationData["documents"]>) => void;
}

export function DocumentsStep({ data, onChange }: DocumentsStepProps) {
  const [errors, setErrors] = useState<Record<FileField, string | null>>({
    nidFile: null,
    incomeProofFile: null,
  });

  function handleFileChange(field: FileField, event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    if (file && file.size > MAX_UPLOAD_BYTES) {
      setErrors((prev) => ({ ...prev, [field]: TOO_LARGE_MESSAGE }));
      event.target.value = "";
      return;
    }
    setErrors((prev) => ({ ...prev, [field]: null }));
    onChange({ [field]: file });
  }

  return (
    <div className="space-y-3">
      <div>
        <Label htmlFor="app-nid-file">National ID (required)</Label>
        <input
          id="app-nid-file"
          type="file"
          accept={ACCEPTED_TYPES}
          onChange={(event) => handleFileChange("nidFile", event)}
          aria-invalid={errors.nidFile ? true : undefined}
          aria-describedby={errors.nidFile ? "app-nid-file-error" : undefined}
          className="block text-sm"
        />
        {errors.nidFile && (
          <p id="app-nid-file-error" role="alert" className="mt-1 text-sm text-red-600">
            {errors.nidFile}
          </p>
        )}
        {data.nidFile && <p className="mt-1 text-sm text-stone-600">Selected: {data.nidFile.name}</p>}
      </div>
      <div>
        <Label htmlFor="app-income-proof-file">Income proof (optional)</Label>
        <input
          id="app-income-proof-file"
          type="file"
          accept={ACCEPTED_TYPES}
          onChange={(event) => handleFileChange("incomeProofFile", event)}
          aria-invalid={errors.incomeProofFile ? true : undefined}
          aria-describedby={errors.incomeProofFile ? "app-income-proof-file-error" : undefined}
          className="block text-sm"
        />
        {errors.incomeProofFile && (
          <p id="app-income-proof-file-error" role="alert" className="mt-1 text-sm text-red-600">
            {errors.incomeProofFile}
          </p>
        )}
        {data.incomeProofFile && (
          <p className="mt-1 text-sm text-stone-600">Selected: {data.incomeProofFile.name}</p>
        )}
      </div>
    </div>
  );
}
