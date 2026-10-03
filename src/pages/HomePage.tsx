import { HeroSearch } from "../components/HeroSearch";
import { FeaturedListings } from "../components/FeaturedListings";
import { TrustSection } from "../components/TrustSection";

export default function HomePage() {
  return (
    <div>
      <section className="bg-accent-50 px-4 py-16 text-center">
        <h1 className="text-3xl font-bold text-stone-900 sm:text-4xl">
          Better Properties. Better Management. Better Living.
        </h1>
        <p className="mt-3 text-stone-600">
          Find verified rental homes across Dhaka — from Gulshan to Mirpur.
        </p>
        <div className="mx-auto mt-8 max-w-3xl">
          <HeroSearch />
        </div>
      </section>
      <FeaturedListings />
      <TrustSection />
    </div>
  );
}
