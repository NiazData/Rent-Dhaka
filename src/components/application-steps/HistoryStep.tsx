import { Input } from "../ui/input";
import { Label } from "../ui/label";
import type { ApplicationData } from "../../hooks/useApplicationForm";

interface HistoryStepProps {
  data: ApplicationData["history"];
  onChange: (fields: Partial<ApplicationData["history"]>) => void;
}

export function HistoryStep({ data, onChange }: HistoryStepProps) {
  return (
    <div className="space-y-3">
      <div>
        <Label htmlFor="app-previous-address">Previous address</Label>
        <Input
          id="app-previous-address"
          value={data.previousAddress}
          onChange={(e) => onChange({ previousAddress: e.target.value })}
        />
      </div>
      <div>
        <Label htmlFor="app-landlord-contact">Previous landlord contact (optional)</Label>
        <Input
          id="app-landlord-contact"
          value={data.previousLandlordContact}
          onChange={(e) => onChange({ previousLandlordContact: e.target.value })}
        />
      </div>
    </div>
  );
}
