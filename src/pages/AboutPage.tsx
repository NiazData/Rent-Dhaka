import { TestimonialsList } from "../components/TestimonialsList";

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-bold text-stone-900">About This Company</h1>
      <p className="mt-3 max-w-2xl text-stone-600">
        The Company has helped find verified homes across Dhaka for over 10 years, working
        directly with landlords in Gulshan, Dhanmondi, Banani, Uttara, Mohammadpur, and beyond to
        keep listings accurate and leases straightforward.
      </p>

      <div className="mt-6 max-w-md">
        <img
          src="/images/about/about.jpeg"
          alt="Rent Dhaka"
          className="h-64 w-full rounded-lg bg-stone-100 object-contain"
        />
        <p className="mt-4 text-sm text-stone-600">
          Mohammadpur
          <br />
          Dhaka-1207
          <br />
          Bangladesh
        </p>
      </div>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-stone-900">What Customers Say</h2>
        <div className="mt-6">
          <TestimonialsList />
        </div>
      </section>
    </div>
  );
}
