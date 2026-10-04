import { useState } from "react";

export type ApplicationStep = "personal" | "employment" | "history" | "documents" | "review";

export interface ApplicationData {
  personal: { fullName: string; email: string; phone: string };
  employment: { employer: string; position: string; monthlyIncomeBDT: number };
  history: { previousAddress: string; previousLandlordContact: string };
  documents: { nidFile: File | null; incomeProofFile: File | null };
}

const STEP_ORDER: ApplicationStep[] = ["personal", "employment", "history", "documents", "review"];

const initialData: ApplicationData = {
  personal: { fullName: "", email: "", phone: "" },
  employment: { employer: "", position: "", monthlyIncomeBDT: 0 },
  history: { previousAddress: "", previousLandlordContact: "" },
  documents: { nidFile: null, incomeProofFile: null },
};

function isStepValid(step: ApplicationStep, data: ApplicationData): boolean {
  switch (step) {
    case "personal":
      return (
        data.personal.fullName.trim().length > 0 &&
        /\S+@\S+\.\S+/.test(data.personal.email) &&
        data.personal.phone.trim().length > 0
      );
    case "employment":
      return data.employment.employer.trim().length > 0 && data.employment.monthlyIncomeBDT > 0;
    case "history":
      return data.history.previousAddress.trim().length > 0;
    case "documents":
      return data.documents.nidFile !== null;
    case "review":
      return true;
  }
}

export interface UseApplicationFormResult {
  step: ApplicationStep;
  data: ApplicationData;
  canGoNext: boolean;
  isFirstStep: boolean;
  isLastStep: boolean;
  updatePersonal(fields: Partial<ApplicationData["personal"]>): void;
  updateEmployment(fields: Partial<ApplicationData["employment"]>): void;
  updateHistory(fields: Partial<ApplicationData["history"]>): void;
  updateDocuments(fields: Partial<ApplicationData["documents"]>): void;
  goNext(): void;
  goBack(): void;
}

export function useApplicationForm(): UseApplicationFormResult {
  const [stepIndex, setStepIndex] = useState(0);
  const [data, setData] = useState<ApplicationData>(initialData);

  const step = STEP_ORDER[stepIndex];

  function goNext() {
    if (isStepValid(step, data) && stepIndex < STEP_ORDER.length - 1) {
      setStepIndex((i) => i + 1);
    }
  }

  function goBack() {
    if (stepIndex > 0) {
      setStepIndex((i) => i - 1);
    }
  }

  return {
    step,
    data,
    canGoNext: isStepValid(step, data),
    isFirstStep: stepIndex === 0,
    isLastStep: stepIndex === STEP_ORDER.length - 1,
    updatePersonal: (fields) => setData((d) => ({ ...d, personal: { ...d.personal, ...fields } })),
    updateEmployment: (fields) => setData((d) => ({ ...d, employment: { ...d.employment, ...fields } })),
    updateHistory: (fields) => setData((d) => ({ ...d, history: { ...d.history, ...fields } })),
    updateDocuments: (fields) => setData((d) => ({ ...d, documents: { ...d.documents, ...fields } })),
    goNext,
    goBack,
  };
}
