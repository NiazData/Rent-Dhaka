import type { ChangeEvent } from "react";
import { Label } from "../ui/label";
import type { ApplicationData } from "../../hooks/useApplicationForm";

interface DocumentsStepProps {
  data: ApplicationData["documents"];
  onChange: (fields: Partial<ApplicationData["documents"]>) => void;
}

export function DocumentsStep({ data, onChange }: DocumentsStepProps) {
  function handleNidChange(event: ChangeEvent<HTMLInputElement>) {
    onChange({ nidFile: event.target.files?.[0] ?? null });
  }

  function handleIncomeProofChange(event: ChangeEvent<HTMLInputElement>) {
    onChange({ incomeProofFile: event.target.files?.[0] ?? null });
  }

  return (
    <div className="space-y-3">
      <div>
        <Label htmlFor="app-nid-file">National ID (required)</Label>
        <input id="app-nid-file" type="file" onChange={handleNidChange} className="block text-sm" />
        {data.nidFile && <p className="mt-1 text-sm text-stone-600">Selected: {data.nidFile.name}</p>}
      </div>
      <div>
        <Label htmlFor="app-income-proof-file">Income proof (optional)</Label>
        <input
          id="app-income-proof-file"
          type="file"
          onChange={handleIncomeProofChange}
          className="block text-sm"
        />
        {data.incomeProofFile && (
          <p className="mt-1 text-sm text-stone-600">Selected: {data.incomeProofFile.name}</p>
        )}
      </div>
    </div>
  );
}
