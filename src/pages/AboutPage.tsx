import { TeamGrid } from "../components/TeamGrid";
import { TestimonialsList } from "../components/TestimonialsList";

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-bold text-stone-900">About Rent Dhaka</h1>
      <p className="mt-3 max-w-2xl text-stone-600">
        Rent Dhaka has helped renters find verified homes across Dhaka for over 8 years, working
        directly with landlords in Gulshan, Dhanmondi, Banani, Uttara, and beyond to keep listings
        accurate and leases straightforward.
      </p>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-stone-900">Our Team</h2>
        <div className="mt-6">
          <TeamGrid />
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-stone-900">What Renters Say</h2>
        <div className="mt-6">
          <TestimonialsList />
        </div>
      </section>
    </div>
  );
}
