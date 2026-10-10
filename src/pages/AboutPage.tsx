import { TestimonialsList } from "../components/TestimonialsList";

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-bold text-stone-900">About This Company</h1>

      <div className="mt-6 flex flex-col gap-10 md:flex-row">
        <div className="space-y-4 text-justify text-stone-600 md:flex-1">
          <p>
            Iman Homes was founded in 2014 on a simple belief: that a home is more than a
            structure — it is the foundation of a life. From our very first project, we
            committed to building with materials that last, designs that inspire, and a process
            that respects the trust our clients place in us.
          </p>
          <p>
            Over the past decade, we have successfully completed four landmark projects — 12,
            10, 9, and 6-storey buildings spread across Bangladesh — delivering 100+ apartments
            directly into the hands of our customers. We don't just hand over a unit; we wait
            for every client to arrive and personally place the keys in their hands.
          </p>
          <p>
            We also work closely with landowners who want to develop their property. Bring us
            your land and your vision — we bring the manpower, expertise, and commitment to
            build exactly what you have in mind. No tension, no shortcuts. Just results.
          </p>
          <blockquote className="border-l-4 border-accent-200 pl-4 italic text-stone-700">
            "Your land, our manpower, work together."
          </blockquote>
          <p>
            Whether you're building, buying, or selling — bring us your land, your vision, or
            your property. We'll take it from there.
          </p>
        </div>

        <div className="md:w-80 md:flex-shrink-0">
          <img
            src="/images/about/about.jpeg"
            alt="Iman Homes"
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
