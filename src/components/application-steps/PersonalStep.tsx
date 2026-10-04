import { Input } from "../ui/input";
import { Label } from "../ui/label";
import type { ApplicationData } from "../../hooks/useApplicationForm";

interface PersonalStepProps {
  data: ApplicationData["personal"];
  onChange: (fields: Partial<ApplicationData["personal"]>) => void;
}

export function PersonalStep({ data, onChange }: PersonalStepProps) {
  return (
    <div className="space-y-3">
      <div>
        <Label htmlFor="app-full-name">Full name</Label>
        <Input
          id="app-full-name"
          value={data.fullName}
          onChange={(e) => onChange({ fullName: e.target.value })}
        />
      </div>
      <div>
        <Label htmlFor="app-email">Email</Label>
        <Input
          id="app-email"
          type="email"
          value={data.email}
          onChange={(e) => onChange({ email: e.target.value })}
        />
      </div>
      <div>
        <Label htmlFor="app-phone">Phone</Label>
        <Input id="app-phone" value={data.phone} onChange={(e) => onChange({ phone: e.target.value })} />
      </div>
    </div>
  );
}
