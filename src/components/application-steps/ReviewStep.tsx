import { formatBDT } from "../../lib/format";
import type { ApplicationData } from "../../hooks/useApplicationForm";

export function ReviewStep({ data }: { data: ApplicationData }) {
  return (
    <div className="space-y-2 text-sm text-stone-700">
      <p>
        <strong>{data.personal.fullName}</strong> • {data.personal.email} • {data.personal.phone}
      </p>
      <p>
        {data.employment.employer} ({data.employment.position}) —{" "}
        {formatBDT(data.employment.monthlyIncomeBDT)}/mo income
      </p>
      <p>Previous address: {data.history.previousAddress}</p>
      <p>National ID: {data.documents.nidFile?.name ?? "Not provided"}</p>
      <p>Income proof: {data.documents.incomeProofFile?.name ?? "Not provided"}</p>
    </div>
  );
}
