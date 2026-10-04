import { Input } from "../ui/input";
import { Label } from "../ui/label";
import type { ApplicationData } from "../../hooks/useApplicationForm";

interface EmploymentStepProps {
  data: ApplicationData["employment"];
  onChange: (fields: Partial<ApplicationData["employment"]>) => void;
}

export function EmploymentStep({ data, onChange }: EmploymentStepProps) {
  return (
    <div className="space-y-3">
      <div>
        <Label htmlFor="app-employer">Employer</Label>
        <Input
          id="app-employer"
          value={data.employer}
          onChange={(e) => onChange({ employer: e.target.value })}
        />
      </div>
      <div>
        <Label htmlFor="app-position">Position</Label>
        <Input
          id="app-position"
          value={data.position}
          onChange={(e) => onChange({ position: e.target.value })}
        />
      </div>
      <div>
        <Label htmlFor="app-income">Monthly income (BDT)</Label>
        <Input
          id="app-income"
          type="number"
          value={data.monthlyIncomeBDT || ""}
          onChange={(e) => onChange({ monthlyIncomeBDT: Number(e.target.value) })}
        />
      </div>
    </div>
  );
}
