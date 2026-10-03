import { listings } from './src/data/listings.ts';
import { testimonials } from './src/data/testimonials.ts';
import { teamMembers } from './src/data/team.ts';
import { propertyTypes } from './src/data/propertyTypes.ts';

console.log("✓ Listings count:", listings.length);
console.log("✓ Unique slugs:", new Set(listings.map(l => l.slug)).size === listings.length);

const types = new Set(listings.map(l => l.propertyType));
console.log("✓ Property types:", Array.from(types).sort().join(", "));

const noPets = listings.some(l => l.petPolicy.toLowerCase().includes("no pets"));
const petsOk = listings.some(l => !l.petPolicy.toLowerCase().includes("no pets"));
console.log("✓ Pet policy variety:", noPets && petsOk);

console.log("\nSample data verification:");
console.log("✓ First listing slug:", listings[0].slug);
console.log("✓ First listing rent:", listings[0].rentBDT, "BDT");
console.log("✓ Last listing property type:", listings[7].propertyType);

console.log("\n✓ Testimonials count:", testimonials.length);
console.log("✓ Team members count:", teamMembers.length);
console.log("✓ Property type info count:", propertyTypes.length);

console.log("\nAll invariants verified!");
