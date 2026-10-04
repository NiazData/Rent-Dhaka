import { useState } from "react";
import { useParams } from "react-router-dom";
import { getListingBySlug } from "../lib/listings-repository";
import { useApplicationForm, type ApplicationStep } from "../hooks/useApplicationForm";
import { submitApplication } from "../lib/netlify-forms";
import { NotFoundMessage } from "../components/NotFoundMessage";
import { PersonalStep } from "../components/application-steps/PersonalStep";
import { EmploymentStep } from "../components/application-steps/EmploymentStep";
import { HistoryStep } from "../components/application-steps/HistoryStep";
import { DocumentsStep } from "../components/application-steps/DocumentsStep";
import { ReviewStep } from "../components/application-steps/ReviewStep";
import { Progress } from "../components/ui/progress";
import { Button } from "../components/ui/button";

const STEP_ORDER: ApplicationStep[] = ["personal", "employment", "history", "documents", "review"];

const STEP_LABELS: Record<ApplicationStep, string> = {
  personal: "Personal",
  employment: "Employment",
  history: "Rental History",
  documents: "Documents",
  review: "Review",
};

export default function ApplicationPage() {
  const { slug } = useParams<{ slug: string }>();
  const listing = slug ? getListingBySlug(slug) : undefined;
  const form = useApplicationForm();
  const [submitStatus, setSubmitStatus] = useState<"idle" | "submitting" | "success" | "error">(
    "idle"
  );

  if (!listing) {
    return (
      <NotFoundMessage
        heading="Listing not found"
        message="We couldn't find a listing to apply for. Browse current listings instead."
      />
    );
  }

  const progressValue = ((STEP_ORDER.indexOf(form.step) + 1) / STEP_ORDER.length) * 100;
  const listingSlug = listing.slug;

  async function handleFinalSubmit() {
    setSubmitStatus("submitting");
    try {
      await submitApplication({ listingSlug, ...form.data });
      setSubmitStatus("success");
    } catch {
      setSubmitStatus("error");
    }
  }

  if (submitStatus === "success") {
    return (
      <div role="status" className="mx-auto max-w-xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-stone-900">Application Submitted</h1>
        <p className="mt-2 text-stone-600">
          Thanks for applying to {listing.title}. We'll be in touch soon.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-8">
      <h1 className="text-2xl font-bold text-stone-900">Apply for {listing.title}</h1>
      <p className="mt-1 text-sm text-stone-600">
        Step {STEP_ORDER.indexOf(form.step) + 1} of {STEP_ORDER.length}: {STEP_LABELS[form.step]}
      </p>
      <Progress value={progressValue} className="mt-3" />

      <div className="mt-6">
        {form.step === "personal" && (
          <PersonalStep data={form.data.personal} onChange={form.updatePersonal} />
        )}
        {form.step === "employment" && (
          <EmploymentStep data={form.data.employment} onChange={form.updateEmployment} />
        )}
        {form.step === "history" && (
          <HistoryStep data={form.data.history} onChange={form.updateHistory} />
        )}
        {form.step === "documents" && (
          <DocumentsStep data={form.data.documents} onChange={form.updateDocuments} />
        )}
        {form.step === "review" && <ReviewStep data={form.data} />}
      </div>

      {submitStatus === "error" && (
        <p role="alert" className="mt-4 text-sm text-red-600">
          Something went wrong submitting your application. Please try again.
        </p>
      )}

      <div className="mt-6 flex justify-between">
        <Button variant="outline" onClick={form.goBack} disabled={form.isFirstStep}>
          Back
        </Button>
        {form.isLastStep ? (
          <Button onClick={handleFinalSubmit} disabled={submitStatus === "submitting"}>
            {submitStatus === "submitting" ? "Submitting..." : "Submit Application"}
          </Button>
        ) : (
          <Button onClick={form.goNext} disabled={!form.canGoNext}>
            Next
          </Button>
        )}
      </div>
    </div>
  );
}
