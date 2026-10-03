# Rent Dhaka Rental Marketplace Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a static (no-backend) React/Vite rental marketplace website for Dhaka, Bangladesh — homepage, searchable/filterable listings with map view, property detail pages, a guest rental-application flow, property-type SEO pages, and trust/about/contact content — styled with Tailwind + local shadcn-style primitives.

**Architecture:** All content lives in typed, hardcoded TS data modules under `src/data/`, accessed only through repository functions in `src/lib/`. Pages/components call the repository, never the data files directly, so a future backend can replace the repository internals without touching any page. Rental applications and tour requests submit through Netlify Forms (no custom API).

**Tech Stack:** Vite, React 18, TypeScript (strict), React Router v6, Tailwind CSS, Radix UI primitives (hand-wired as local shadcn-style components), Leaflet + react-leaflet + OpenStreetMap, Vitest + React Testing Library + jest-axe.

**Spec:** `docs/superpowers/specs/2026-10-03-rent-dhaka-rental-marketplace-design.md`

## Global Constraints

- No backend, database, or payment processing — all content hardcoded in `src/data/`, all form submissions via Netlify Forms (spec §2, §3).
- Pages and components never import `src/data/*` directly — only through `src/lib/listings-repository.ts` or `src/lib/content-repository.ts` (spec §3, §4).
- Styling via Tailwind CSS + local primitives in `src/components/ui/` only — no external component library dependency.
- Maps via Leaflet + OpenStreetMap only — no Google Maps, no API keys (spec §4).
- All currency is Bangladeshi Taka, rendered only via `formatBDT()` — never a raw number in the DOM.
- TypeScript strict mode is enabled project-wide.
- Node 18+ for all tooling.
- All automated tests use Vitest + React Testing Library; accessibility tests use jest-axe.

## Review Focus

- Zero-result filter combinations on `/listings` must show a clear empty state, not a blank list — covered in Task 8.
- Direct navigation to an unknown listing slug or unknown property-type param must show a clear not-found message, not a crash — covered in Task 10 and Task 13.
- A failed Netlify Forms submission (network error) on the tour-request or application form must show a visible error message, not fail silently — covered in Task 11 and Task 12.
- BDT rent values must render with Bangladeshi (lakh-style) digit grouping via `formatBDT()`, never a raw or Western-grouped number — covered in Task 5 and Task 7.
- Keyboard-only users must be able to operate the photo gallery and reach the mobile sticky Apply button — covered in Task 10.

---

## Task 1: Project scaffolding

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `tsconfig.node.json`
- Create: `vite.config.ts`
- Create: `tailwind.config.js`
- Create: `postcss.config.js`
- Create: `index.html`
- Create: `src/main.tsx`
- Create: `src/index.css`
- Create: `src/App.tsx`
- Create: `src/test/setup.ts`
- Test: `src/App.test.tsx`

**Interfaces:**
- Consumes: nothing (first task)
- Produces: a runnable Vite+React+TS project with `npm run dev`, `npm run build`, `npm run test` scripts, Tailwind wired into `src/index.css`, and Vitest configured with jsdom + jest-dom matchers. `App` component in `src/App.tsx` is the composition root later tasks modify.

- [ ] **Step 1: Write the failing test**

Create `src/App.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import App from "./App";

describe("App", () => {
  it("renders the site name", () => {
    render(<App />);
    expect(screen.getByText(/rent dhaka/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Create project config files**

Create `package.json`:

```json
{
  "name": "rent-dhaka",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "test": "vitest run"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.26.0",
    "leaflet": "^1.9.4",
    "react-leaflet": "^4.2.1",
    "clsx": "^2.1.1",
    "tailwind-merge": "^2.5.2",
    "class-variance-authority": "^0.7.0",
    "lucide-react": "^0.447.0",
    "@radix-ui/react-dialog": "^1.1.1",
    "@radix-ui/react-checkbox": "^1.1.1",
    "@radix-ui/react-progress": "^1.1.0",
    "@radix-ui/react-label": "^2.1.0"
  },
  "devDependencies": {
    "@types/react": "^18.3.9",
    "@types/react-dom": "^18.3.0",
    "@types/leaflet": "^1.9.12",
    "@vitejs/plugin-react": "^4.3.1",
    "typescript": "^5.6.2",
    "vite": "^5.4.7",
    "tailwindcss": "^3.4.13",
    "postcss": "^8.4.47",
    "autoprefixer": "^10.4.20",
    "vitest": "^2.1.1",
    "jsdom": "^25.0.0",
    "@testing-library/react": "^16.0.1",
    "@testing-library/jest-dom": "^6.5.0",
    "@testing-library/user-event": "^14.5.2",
    "jest-axe": "^9.0.0"
  }
}
```

Create `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "types": ["vitest/globals", "@testing-library/jest-dom"]
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

Create `tsconfig.node.json`:

```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}
```

Create `vite.config.ts`:

```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts",
    globals: true,
  },
});
```

Create `tailwind.config.js`:

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

Create `postcss.config.js`:

```js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

Create `index.html`:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Rent Dhaka — Find Your Next Home</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

Create `src/index.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

Create `src/main.tsx`:

```tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

Create `src/test/setup.ts`:

```ts
import "@testing-library/jest-dom/vitest";
```

- [ ] **Step 3: Run `npm install`**

Run: `npm install`
Expected: dependencies install with no errors.

- [ ] **Step 4: Run test to verify it fails**

Run: `npx vitest run src/App.test.tsx`
Expected: FAIL — `src/App.tsx` does not exist yet.

- [ ] **Step 5: Write minimal implementation**

Create `src/App.tsx`:

```tsx
function App() {
  return <div>Rent Dhaka</div>;
}

export default App;
```

- [ ] **Step 6: Run test to verify it passes**

Run: `npx vitest run src/App.test.tsx`
Expected: PASS

- [ ] **Step 7: Verify build works**

Run: `npm run build`
Expected: builds successfully with no TypeScript errors.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "chore: scaffold Vite+React+TS project with Tailwind and Vitest"
```

---

## Task 2: Design system primitives and layout shell

**Files:**
- Modify: `tailwind.config.js`
- Create: `src/lib/cn.ts`
- Create: `src/components/ui/button.tsx`
- Create: `src/components/ui/card.tsx`
- Create: `src/components/ui/input.tsx`
- Create: `src/components/ui/label.tsx`
- Create: `src/components/Header.tsx`
- Create: `src/components/Footer.tsx`
- Create: `src/components/Layout.tsx`
- Test: `src/components/ui/button.test.tsx`
- Test: `src/components/Layout.test.tsx`

**Interfaces:**
- Consumes: nothing new (pure UI layer)
- Produces: `cn(...classes)` util in `src/lib/cn.ts`; `Button`, `Card`/`CardHeader`/`CardContent`, `Input`, `Label` in `src/components/ui/`; `Header`, `Footer`, `Layout` (wraps `<Outlet/>`, renders `<main id="main-content">`) in `src/components/`. Tailwind `accent` color scale available in `tailwind.config.js` theme.

- [ ] **Step 1: Write the failing test for Button**

Create `src/components/ui/button.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Button } from "./button";

describe("Button", () => {
  it("renders as a button with its label", () => {
    render(<Button>Apply Now</Button>);
    expect(screen.getByRole("button", { name: /apply now/i })).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/ui/button.test.tsx`
Expected: FAIL — `./button` does not exist.

- [ ] **Step 3: Add theme tokens and the `cn` util**

Modify `tailwind.config.js`:

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        accent: {
          50: "#fdf4f1",
          100: "#fbe6de",
          200: "#f5c7b4",
          300: "#eca386",
          400: "#dd7753",
          500: "#c2572a",
          600: "#a8451e",
          700: "#8a3718",
          800: "#6e2c15",
          900: "#592412",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
```

Create `src/lib/cn.ts`:

```ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

- [ ] **Step 4: Implement Button, Card, Input, Label**

Create `src/components/ui/button.tsx`:

```tsx
import { type ButtonHTMLAttributes, forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-accent-600 text-white hover:bg-accent-700",
        secondary: "bg-stone-100 text-stone-900 hover:bg-stone-200",
        outline: "border border-stone-300 bg-transparent hover:bg-stone-50",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 px-3 text-xs",
        lg: "h-12 px-6 text-base",
      },
    },
    defaultVariants: { variant: "primary", size: "default" },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  )
);
Button.displayName = "Button";
```

Create `src/components/ui/card.tsx`:

```tsx
import { type HTMLAttributes } from "react";
import { cn } from "../../lib/cn";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("rounded-lg border border-stone-200 bg-white shadow-sm", className)}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-4 pb-0", className)} {...props} />;
}

export function CardContent({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-4", className)} {...props} />;
}
```

Create `src/components/ui/input.tsx`:

```tsx
import { type InputHTMLAttributes, forwardRef } from "react";
import { cn } from "../../lib/cn";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "h-10 w-full rounded-md border border-stone-300 bg-white px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";
```

Create `src/components/ui/label.tsx`:

```tsx
import { type LabelHTMLAttributes } from "react";
import { cn } from "../../lib/cn";

export function Label({ className, ...props }: LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className={cn("text-sm font-medium text-stone-700", className)} {...props} />;
}
```

- [ ] **Step 5: Run Button test to verify it passes**

Run: `npx vitest run src/components/ui/button.test.tsx`
Expected: PASS

- [ ] **Step 6: Write the failing test for Layout**

Create `src/components/Layout.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { Layout } from "./Layout";

describe("Layout", () => {
  it("renders header nav, a skip link, and footer around the routed page", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<div>Page Content</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByRole("link", { name: /skip to content/i })).toHaveAttribute(
      "href",
      "#main-content"
    );
    expect(screen.getByRole("link", { name: /^home$/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /listings/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /about/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /contact/i })).toBeInTheDocument();
    expect(screen.getByText("Page Content")).toBeInTheDocument();
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
  });
});
```

- [ ] **Step 7: Run test to verify it fails**

Run: `npx vitest run src/components/Layout.test.tsx`
Expected: FAIL — `./Layout` does not exist.

- [ ] **Step 8: Implement Header, Footer, Layout**

Create `src/components/Header.tsx`:

```tsx
import { Link } from "react-router-dom";

export function Header() {
  return (
    <header className="border-b border-stone-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link to="/" className="text-lg font-bold text-accent-700">
          Rent Dhaka
        </Link>
        <nav aria-label="Main" className="flex gap-6 text-sm font-medium text-stone-700">
          <Link to="/" className="hover:text-accent-600">
            Home
          </Link>
          <Link to="/listings" className="hover:text-accent-600">
            Listings
          </Link>
          <Link to="/about" className="hover:text-accent-600">
            About
          </Link>
          <Link to="/contact" className="hover:text-accent-600">
            Contact
          </Link>
        </nav>
      </div>
    </header>
  );
}
```

Create `src/components/Footer.tsx`:

```tsx
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="border-t border-stone-200 bg-stone-50">
      <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-stone-600">
        <p className="font-semibold text-stone-900">Rent Dhaka</p>
        <p className="mt-1">Helping renters find verified homes across Dhaka.</p>
        <nav aria-label="Footer" className="mt-4 flex gap-4">
          <Link to="/privacy" className="hover:text-accent-600">
            Privacy Policy
          </Link>
          <Link to="/contact" className="hover:text-accent-600">
            Contact Us
          </Link>
        </nav>
      </div>
    </footer>
  );
}
```

Create `src/components/Layout.tsx`:

```tsx
import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { Footer } from "./Footer";

export function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-accent-600 focus:px-3 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>
      <Header />
      <main id="main-content" className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
```

- [ ] **Step 9: Run test to verify it passes**

Run: `npx vitest run src/components/Layout.test.tsx`
Expected: PASS

- [ ] **Step 10: Commit**

```bash
git add -A
git commit -m "feat: add design system primitives and layout shell"
```

---

## Task 3: Routing skeleton

**Files:**
- Create: `src/AppRoutes.tsx`
- Create: `src/pages/HomePage.tsx`
- Create: `src/pages/ListingsPage.tsx`
- Create: `src/pages/ListingDetailPage.tsx`
- Create: `src/pages/ApplicationPage.tsx`
- Create: `src/pages/PropertyTypePage.tsx`
- Create: `src/pages/AboutPage.tsx`
- Create: `src/pages/ContactPage.tsx`
- Create: `src/pages/PrivacyPolicyPage.tsx`
- Create: `src/pages/NotFoundPage.tsx`
- Modify: `src/App.tsx`
- Test: `src/AppRoutes.test.tsx`

**Interfaces:**
- Consumes: `Layout` from Task 2
- Produces: `AppRoutes` component (the `<Routes>` tree, importable without a router wrapper for testing); stub page components at their final file paths — every later task that adds real page content does so by **modifying** one of these files, never creating a new one.

- [ ] **Step 1: Write the failing test**

Create `src/AppRoutes.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { AppRoutes } from "./AppRoutes";

function renderAt(path: string) {
  render(
    <MemoryRouter initialEntries={[path]}>
      <AppRoutes />
    </MemoryRouter>
  );
}

describe("AppRoutes", () => {
  it("renders the home page at /", () => {
    renderAt("/");
    expect(screen.getByRole("heading", { name: /home/i })).toBeInTheDocument();
  });

  it("renders the listings page at /listings", () => {
    renderAt("/listings");
    expect(screen.getByRole("heading", { name: /listings/i })).toBeInTheDocument();
  });

  it("renders the listing detail page at /listings/:slug", () => {
    renderAt("/listings/some-slug");
    expect(screen.getByRole("heading", { name: /listing detail/i })).toBeInTheDocument();
  });

  it("renders the application page at /apply/:slug", () => {
    renderAt("/apply/some-slug");
    expect(screen.getByRole("heading", { name: /application/i })).toBeInTheDocument();
  });

  it("renders the property type page at /property-types/:type", () => {
    renderAt("/property-types/apartment");
    expect(screen.getByRole("heading", { name: /property type/i })).toBeInTheDocument();
  });

  it("renders the about page", () => {
    renderAt("/about");
    expect(screen.getByRole("heading", { name: /about/i })).toBeInTheDocument();
  });

  it("renders the contact page", () => {
    renderAt("/contact");
    expect(screen.getByRole("heading", { name: /contact/i })).toBeInTheDocument();
  });

  it("renders the privacy page", () => {
    renderAt("/privacy");
    expect(screen.getByRole("heading", { name: /privacy/i })).toBeInTheDocument();
  });

  it("renders the not found page for an unknown route", () => {
    renderAt("/nonexistent");
    expect(screen.getByRole("heading", { name: /page not found/i })).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/AppRoutes.test.tsx`
Expected: FAIL — `./AppRoutes` does not exist.

- [ ] **Step 3: Create stub page components**

Create `src/pages/HomePage.tsx`:

```tsx
export default function HomePage() {
  return <h1>Home</h1>;
}
```

Create `src/pages/ListingsPage.tsx`:

```tsx
export default function ListingsPage() {
  return <h1>Listings</h1>;
}
```

Create `src/pages/ListingDetailPage.tsx`:

```tsx
export default function ListingDetailPage() {
  return <h1>Listing Detail</h1>;
}
```

Create `src/pages/ApplicationPage.tsx`:

```tsx
export default function ApplicationPage() {
  return <h1>Application</h1>;
}
```

Create `src/pages/PropertyTypePage.tsx`:

```tsx
export default function PropertyTypePage() {
  return <h1>Property Type</h1>;
}
```

Create `src/pages/AboutPage.tsx`:

```tsx
export default function AboutPage() {
  return <h1>About</h1>;
}
```

Create `src/pages/ContactPage.tsx`:

```tsx
export default function ContactPage() {
  return <h1>Contact</h1>;
}
```

Create `src/pages/PrivacyPolicyPage.tsx`:

```tsx
export default function PrivacyPolicyPage() {
  return <h1>Privacy Policy</h1>;
}
```

Create `src/pages/NotFoundPage.tsx`:

```tsx
import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="mx-auto max-w-xl px-4 py-16 text-center">
      <h1 className="text-2xl font-bold">Page Not Found</h1>
      <p className="mt-2 text-stone-600">
        The page you're looking for doesn't exist.
      </p>
      <Link to="/" className="mt-4 inline-block text-accent-600 underline">
        Back to home
      </Link>
    </div>
  );
}
```

- [ ] **Step 4: Create AppRoutes and wire it into App**

Create `src/AppRoutes.tsx`:

```tsx
import { Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import HomePage from "./pages/HomePage";
import ListingsPage from "./pages/ListingsPage";
import ListingDetailPage from "./pages/ListingDetailPage";
import ApplicationPage from "./pages/ApplicationPage";
import PropertyTypePage from "./pages/PropertyTypePage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import NotFoundPage from "./pages/NotFoundPage";

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="listings" element={<ListingsPage />} />
        <Route path="listings/:slug" element={<ListingDetailPage />} />
        <Route path="apply/:slug" element={<ApplicationPage />} />
        <Route path="property-types/:type" element={<PropertyTypePage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="privacy" element={<PrivacyPolicyPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
```

Modify `src/App.tsx`:

```tsx
import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./AppRoutes";

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
```

- [ ] **Step 5: Update the Task 1 smoke test for the new App content**

Modify `src/App.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import App from "./App";

describe("App", () => {
  it("renders the home page by default", () => {
    render(<App />);
    expect(screen.getByRole("heading", { name: /home/i })).toBeInTheDocument();
  });
});
```

- [ ] **Step 6: Run tests to verify they pass**

Run: `npx vitest run src/AppRoutes.test.tsx src/App.test.tsx`
Expected: PASS (9 tests in AppRoutes, 1 in App)

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: add routing skeleton with stub pages"
```

---

## Task 4: Data types and seed data

**Files:**
- Create: `src/types/index.ts`
- Create: `src/data/listings.ts`
- Create: `src/data/testimonials.ts`
- Create: `src/data/team.ts`
- Create: `src/data/propertyTypes.ts`
- Test: `src/data/listings.test.ts`

**Interfaces:**
- Consumes: nothing new
- Produces: types `Listing`, `PropertyType`, `Testimonial`, `TeamMember`, `PropertyTypeInfo`, `ListingFilters` in `src/types/index.ts`; arrays `listings`, `testimonials`, `teamMembers`, `propertyTypes` in their respective `src/data/*.ts` files. These arrays are consumed ONLY by the repository layer built in Task 5/6 — no other file imports `src/data/*` directly (Global Constraints).

- [ ] **Step 1: Write the failing test**

Create `src/data/listings.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { listings } from "./listings";

describe("listings seed data", () => {
  it("has at least 8 listings", () => {
    expect(listings.length).toBeGreaterThanOrEqual(8);
  });

  it("has unique slugs", () => {
    const slugs = listings.map((listing) => listing.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("has valid, plausible fields for every listing", () => {
    for (const listing of listings) {
      expect(listing.rentBDT).toBeGreaterThan(0);
      expect(listing.depositBDT).toBeGreaterThanOrEqual(0);
      expect(listing.beds).toBeGreaterThanOrEqual(0);
      expect(listing.baths).toBeGreaterThanOrEqual(0);
      expect(listing.sqft).toBeGreaterThan(0);
      expect(listing.photos.length).toBeGreaterThanOrEqual(2);
      expect(listing.amenities.length).toBeGreaterThan(0);
      expect(Number.isNaN(new Date(listing.availableFrom).getTime())).toBe(false);
      expect(listing.lat).toBeGreaterThan(23.6);
      expect(listing.lat).toBeLessThan(23.9);
      expect(listing.lng).toBeGreaterThan(90.3);
      expect(listing.lng).toBeLessThan(90.5);
    }
  });

  it("includes at least one listing with no pets allowed and one that allows pets", () => {
    const noPets = listings.some((l) => l.petPolicy.toLowerCase().includes("no pets"));
    const petsOk = listings.some((l) => !l.petPolicy.toLowerCase().includes("no pets"));
    expect(noPets).toBe(true);
    expect(petsOk).toBe(true);
  });

  it("covers all four property types", () => {
    const types = new Set(listings.map((l) => l.propertyType));
    expect(types).toEqual(new Set(["apartment", "single-family", "condo", "townhome"]));
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/data/listings.test.ts`
Expected: FAIL — `./listings` does not exist.

- [ ] **Step 3: Define types**

Create `src/types/index.ts`:

```ts
export type PropertyType = "apartment" | "single-family" | "condo" | "townhome";

export interface Listing {
  id: string;
  slug: string;
  title: string;
  address: string;
  area: string;
  rentBDT: number;
  depositBDT: number;
  beds: number;
  baths: number;
  sqft: number;
  availableFrom: string;
  propertyType: PropertyType;
  petPolicy: string;
  parking: string;
  amenities: string[];
  utilitiesInfo: string;
  leaseTerms: string;
  photos: string[];
  lat: number;
  lng: number;
  virtualTourUrl?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  quote: string;
  rating: number;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  photo: string;
  bio: string;
}

export interface PropertyTypeInfo {
  type: PropertyType;
  title: string;
  description: string;
  heroImage: string;
}

export interface ListingFilters {
  minRentBDT?: number;
  maxRentBDT?: number;
  area?: string;
  minBeds?: number;
  minBaths?: number;
  propertyType?: PropertyType;
  petsAllowed?: boolean;
  availableBy?: string;
}
```

- [ ] **Step 4: Create seed data**

Create `src/data/listings.ts`:

```ts
import type { Listing } from "../types";

export const listings: Listing[] = [
  {
    id: "l1",
    slug: "gulshan-2-modern-apartment",
    title: "Modern 3-Bedroom Apartment in Gulshan 2",
    address: "House 14, Road 103, Gulshan 2",
    area: "Gulshan 2",
    rentBDT: 55000,
    depositBDT: 110000,
    beds: 3,
    baths: 2,
    sqft: 1600,
    availableFrom: "2026-11-01",
    propertyType: "apartment",
    petPolicy: "Cats and small dogs allowed",
    parking: "1 covered space",
    amenities: ["Generator backup", "Lift", "24/7 security", "Gas line"],
    utilitiesInfo: "Water and gas included; electricity billed separately",
    leaseTerms: "12-month lease, 2 months advance deposit",
    photos: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c",
    ],
    lat: 23.7925,
    lng: 90.4078,
  },
  {
    id: "l2",
    slug: "dhanmondi-family-flat",
    title: "Spacious 4-Bedroom Family Flat in Dhanmondi",
    address: "House 32, Road 9A, Dhanmondi",
    area: "Dhanmondi",
    rentBDT: 70000,
    depositBDT: 140000,
    beds: 4,
    baths: 3,
    sqft: 2100,
    availableFrom: "2026-10-15",
    propertyType: "apartment",
    petPolicy: "No pets",
    parking: "2 open spaces",
    amenities: ["Rooftop access", "Lift", "Generator backup", "CCTV"],
    utilitiesInfo: "Tenant pays all utilities",
    leaseTerms: "12-month lease",
    photos: [
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea",
      "https://images.unsplash.com/photo-1600566752355-35792bedcfea",
    ],
    lat: 23.7461,
    lng: 90.3742,
  },
  {
    id: "l3",
    slug: "banani-executive-condo",
    title: "Executive 3-Bedroom Condo in Banani",
    address: "Road 11, Banani",
    area: "Banani",
    rentBDT: 85000,
    depositBDT: 170000,
    beds: 3,
    baths: 3,
    sqft: 1850,
    availableFrom: "2026-11-15",
    propertyType: "condo",
    petPolicy: "Cats only",
    parking: "1 covered space",
    amenities: ["Swimming pool", "Gym", "24/7 security", "Lift", "Community lounge"],
    utilitiesInfo: "Service charge included; electricity and gas billed separately",
    leaseTerms: "12-month lease, negotiable",
    photos: [
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0",
      "https://images.unsplash.com/photo-1600210491892-03d54c0aaf87",
    ],
    lat: 23.7937,
    lng: 90.4066,
  },
  {
    id: "l4",
    slug: "uttara-cozy-apartment",
    title: "Cozy 2-Bedroom Apartment in Uttara Sector 7",
    address: "Road 5, Sector 7, Uttara",
    area: "Uttara",
    rentBDT: 28000,
    depositBDT: 56000,
    beds: 2,
    baths: 2,
    sqft: 950,
    availableFrom: "2026-10-20",
    propertyType: "apartment",
    petPolicy: "Cats and small dogs allowed",
    parking: "1 open space",
    amenities: ["Generator backup", "Lift", "Nearby school"],
    utilitiesInfo: "Water included; gas and electricity billed separately",
    leaseTerms: "6 or 12-month lease available",
    photos: [
      "https://images.unsplash.com/photo-1554995207-c18c203602cb",
      "https://images.unsplash.com/photo-1598928506311-c55ded91a20c",
    ],
    lat: 23.8759,
    lng: 90.3795,
  },
  {
    id: "l5",
    slug: "bashundhara-riverside-townhome",
    title: "3-Story Townhome near Bashundhara R/A",
    address: "Road 14, Block J, Bashundhara R/A",
    area: "Bashundhara",
    rentBDT: 95000,
    depositBDT: 190000,
    beds: 5,
    baths: 4,
    sqft: 2800,
    availableFrom: "2026-12-01",
    propertyType: "townhome",
    petPolicy: "Pets allowed with approval",
    parking: "2 covered spaces",
    amenities: ["Private garden", "Generator backup", "CCTV", "Rooftop terrace"],
    utilitiesInfo: "Tenant pays all utilities",
    leaseTerms: "12-month lease, 3 months advance",
    photos: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9",
      "https://images.unsplash.com/photo-1600566752229-250ed79470f8",
    ],
    lat: 23.8151,
    lng: 90.4341,
  },
  {
    id: "l6",
    slug: "mirpur-affordable-flat",
    title: "Affordable 2-Bedroom Flat in Mirpur 2",
    address: "Road 2, Mirpur 2",
    area: "Mirpur",
    rentBDT: 18000,
    depositBDT: 36000,
    beds: 2,
    baths: 1,
    sqft: 800,
    availableFrom: "2026-10-10",
    propertyType: "apartment",
    petPolicy: "No pets",
    parking: "Street parking only",
    amenities: ["Generator backup", "Nearby market"],
    utilitiesInfo: "Tenant pays all utilities",
    leaseTerms: "12-month lease",
    photos: [
      "https://images.unsplash.com/photo-1600121848594-d8644e57abab",
      "https://images.unsplash.com/photo-1600566752734-2a0cd66aabac",
    ],
    lat: 23.8015,
    lng: 90.3656,
  },
  {
    id: "l7",
    slug: "gulshan-1-luxury-penthouse-condo",
    title: "Luxury Penthouse Condo in Gulshan 1",
    address: "Road 46, Gulshan 1",
    area: "Gulshan 1",
    rentBDT: 150000,
    depositBDT: 300000,
    beds: 4,
    baths: 4,
    sqft: 3200,
    availableFrom: "2026-11-20",
    propertyType: "condo",
    petPolicy: "Cats and dogs allowed",
    parking: "2 covered spaces",
    amenities: ["Private rooftop terrace", "Swimming pool", "Gym", "24/7 concierge", "Lift"],
    utilitiesInfo: "Service charge included",
    leaseTerms: "12-month lease, negotiable",
    photos: [
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d",
      "https://images.unsplash.com/photo-1600566752355-35792bedcfeb",
    ],
    lat: 23.7806,
    lng: 90.4152,
  },
  {
    id: "l8",
    slug: "dhanmondi-independent-house",
    title: "Independent 5-Bedroom House in Dhanmondi",
    address: "Road 27, Dhanmondi",
    area: "Dhanmondi",
    rentBDT: 180000,
    depositBDT: 360000,
    beds: 5,
    baths: 5,
    sqft: 3500,
    availableFrom: "2027-01-01",
    propertyType: "single-family",
    petPolicy: "Pets allowed",
    parking: "3 open spaces",
    amenities: ["Private garden", "Generator backup", "Rooftop access", "CCTV", "Staff quarters"],
    utilitiesInfo: "Tenant pays all utilities",
    leaseTerms: "12-month lease, 3 months advance",
    photos: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a8",
      "https://images.unsplash.com/photo-1600047509807-ba7baa0f8c19",
    ],
    lat: 23.7383,
    lng: 90.3858,
  },
];
```

Create `src/data/testimonials.ts`:

```ts
import type { Testimonial } from "../types";

export const testimonials: Testimonial[] = [
  {
    id: "t1",
    name: "Rafiq Ahmed",
    quote: "Found our Gulshan apartment within a week — the whole process felt transparent and easy.",
    rating: 5,
  },
  {
    id: "t2",
    name: "Nusrat Jahan",
    quote: "The application process was simple and the team was responsive at every step.",
    rating: 5,
  },
  {
    id: "t3",
    name: "Imran Hossain",
    quote: "Honest listings with real photos — no surprises when we visited in person.",
    rating: 4,
  },
];
```

Create `src/data/team.ts`:

```ts
import type { TeamMember } from "../types";

export const teamMembers: TeamMember[] = [
  {
    id: "m1",
    name: "Shahriar Kabir",
    role: "Founder & Managing Director",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
    bio: "Over 12 years in Dhaka's rental market, Shahriar founded Rent Dhaka to make renting transparent and stress-free.",
  },
  {
    id: "m2",
    name: "Farhana Akter",
    role: "Head of Property Relations",
    photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956",
    bio: "Farhana leads our network of verified landlords and ensures every listing is accurate before it goes live.",
  },
  {
    id: "m3",
    name: "Tanvir Islam",
    role: "Tenant Support Lead",
    photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
    bio: "Tanvir guides applicants through the application and move-in process from first inquiry to signed lease.",
  },
];
```

Create `src/data/propertyTypes.ts`:

```ts
import type { PropertyTypeInfo } from "../types";

export const propertyTypes: PropertyTypeInfo[] = [
  {
    type: "apartment",
    title: "Apartments for Rent in Dhaka",
    description:
      "From compact Mirpur flats to family-sized units in Dhanmondi and Gulshan, Dhaka's apartment market covers every budget and neighborhood. Most apartments include generator backup and lift access, with security deposits typically equal to two months' rent.",
    heroImage: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750",
  },
  {
    type: "single-family",
    title: "Single-Family Homes for Rent in Dhaka",
    description:
      "Independent houses are rarer in central Dhaka but available in areas like Dhanmondi and the outskirts, offering private gardens, multiple floors, and more space for larger families — usually at a premium over comparable apartments.",
    heroImage: "https://images.unsplash.com/photo-1518780664697-55e3ad937233",
  },
  {
    type: "condo",
    title: "Condos for Rent in Dhaka",
    description:
      "Condos in Gulshan and Banani offer building amenities like pools, gyms, and 24/7 concierge service that standalone apartments rarely have, making them popular with expatriates and executives.",
    heroImage: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00",
  },
  {
    type: "townhome",
    title: "Townhomes for Rent in Dhaka",
    description:
      "Multi-story townhomes near Bashundhara and similar planned communities give tenants a private entrance, rooftop space, and room to grow — a middle ground between an apartment and a full independent house.",
    heroImage: "https://images.unsplash.com/photo-1600047509782-20d39509f26d",
  },
];
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npx vitest run src/data/listings.test.ts`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: add typed data model and seed listings/testimonials/team/property-types"
```

---

## Task 5: Listings repository, currency formatting, URL filter parsing

**Files:**
- Create: `src/lib/format.ts`
- Create: `src/lib/listings-repository.ts`
- Test: `src/lib/format.test.ts`
- Test: `src/lib/listings-repository.test.ts`

**Interfaces:**
- Consumes: `Listing`, `ListingFilters`, `PropertyType` types and `listings` array from Task 4
- Produces: `formatBDT(amount: number): string`; `getListings(filters?: ListingFilters): Listing[]`; `getListingBySlug(slug: string): Listing | undefined`; `getFeaturedListings(limit?: number): Listing[]`; `parseListingFiltersFromSearchParams(params: URLSearchParams): ListingFilters`. Task 8 and Task 9 call these exclusively — they never import `src/data/listings.ts` directly.

- [ ] **Step 1: Write the failing test for formatBDT**

Create `src/lib/format.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { formatBDT } from "./format";

describe("formatBDT", () => {
  it("formats zero", () => {
    expect(formatBDT(0)).toBe("৳0");
  });

  it("formats a four-digit amount with thousands grouping", () => {
    expect(formatBDT(45000)).toBe("৳45,000");
  });

  it("formats a seven-digit amount with lakh-style grouping", () => {
    expect(formatBDT(1000000)).toBe("৳10,00,000");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/format.test.ts`
Expected: FAIL — `./format` does not exist.

- [ ] **Step 3: Implement formatBDT**

Create `src/lib/format.ts`:

```ts
export function formatBDT(amount: number): string {
  return `৳${new Intl.NumberFormat("en-IN").format(amount)}`;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/lib/format.test.ts`
Expected: PASS

- [ ] **Step 5: Write the failing tests for the listings repository**

Create `src/lib/listings-repository.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import {
  getFeaturedListings,
  getListingBySlug,
  getListings,
  parseListingFiltersFromSearchParams,
} from "./listings-repository";
import { listings } from "../data/listings";

describe("getListings", () => {
  it("returns all listings when no filters are given", () => {
    expect(getListings()).toHaveLength(listings.length);
  });

  it("filters by minimum rent", () => {
    const result = getListings({ minRentBDT: 80000 });
    expect(result.every((l) => l.rentBDT >= 80000)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
    expect(result.length).toBeLessThan(listings.length);
  });

  it("filters by maximum rent", () => {
    const result = getListings({ maxRentBDT: 30000 });
    expect(result.every((l) => l.rentBDT <= 30000)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });

  it("filters by area, case-insensitively", () => {
    const result = getListings({ area: "dhanmondi" });
    expect(result.length).toBeGreaterThan(0);
    expect(result.every((l) => l.area.toLowerCase() === "dhanmondi")).toBe(true);
  });

  it("filters by minimum beds", () => {
    const result = getListings({ minBeds: 4 });
    expect(result.every((l) => l.beds >= 4)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });

  it("filters by property type", () => {
    const result = getListings({ propertyType: "condo" });
    expect(result.every((l) => l.propertyType === "condo")).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });

  it("filters out listings that explicitly disallow pets when petsAllowed is true", () => {
    const result = getListings({ petsAllowed: true });
    expect(result.every((l) => !l.petPolicy.toLowerCase().includes("no pets"))).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });

  it("combines multiple filters as an intersection", () => {
    const result = getListings({ propertyType: "apartment", maxRentBDT: 30000 });
    expect(
      result.every((l) => l.propertyType === "apartment" && l.rentBDT <= 30000)
    ).toBe(true);
  });

  it("returns an empty array when no listing matches", () => {
    const result = getListings({ minRentBDT: 999999999 });
    expect(result).toEqual([]);
  });
});

describe("getListingBySlug", () => {
  it("returns the matching listing", () => {
    const listing = getListingBySlug("gulshan-2-modern-apartment");
    expect(listing?.title).toBe("Modern 3-Bedroom Apartment in Gulshan 2");
  });

  it("returns undefined for an unknown slug", () => {
    expect(getListingBySlug("does-not-exist")).toBeUndefined();
  });
});

describe("getFeaturedListings", () => {
  it("returns the requested number of listings", () => {
    expect(getFeaturedListings(3)).toHaveLength(3);
  });

  it("defaults to 3 when no limit is given", () => {
    expect(getFeaturedListings()).toHaveLength(3);
  });
});

describe("parseListingFiltersFromSearchParams", () => {
  it("parses all known filter keys", () => {
    const params = new URLSearchParams(
      "minRentBDT=20000&maxRentBDT=80000&area=Gulshan+2&minBeds=2&minBaths=1&propertyType=apartment&petsAllowed=true&availableBy=2026-12-01"
    );
    expect(parseListingFiltersFromSearchParams(params)).toEqual({
      minRentBDT: 20000,
      maxRentBDT: 80000,
      area: "Gulshan 2",
      minBeds: 2,
      minBaths: 1,
      propertyType: "apartment",
      petsAllowed: true,
      availableBy: "2026-12-01",
    });
  });

  it("omits keys that are absent from the search params", () => {
    const params = new URLSearchParams("propertyType=condo");
    expect(parseListingFiltersFromSearchParams(params)).toEqual({ propertyType: "condo" });
  });

  it("returns an empty object for empty search params", () => {
    expect(parseListingFiltersFromSearchParams(new URLSearchParams())).toEqual({});
  });
});
```

- [ ] **Step 6: Run test to verify it fails**

Run: `npx vitest run src/lib/listings-repository.test.ts`
Expected: FAIL — `./listings-repository` does not exist.

- [ ] **Step 7: Implement the listings repository**

Create `src/lib/listings-repository.ts`:

```ts
import { listings } from "../data/listings";
import type { Listing, ListingFilters, PropertyType } from "../types";

export function getListings(filters: ListingFilters = {}): Listing[] {
  return listings.filter((listing) => {
    if (filters.minRentBDT !== undefined && listing.rentBDT < filters.minRentBDT) return false;
    if (filters.maxRentBDT !== undefined && listing.rentBDT > filters.maxRentBDT) return false;
    if (filters.area && listing.area.toLowerCase() !== filters.area.toLowerCase()) return false;
    if (filters.minBeds !== undefined && listing.beds < filters.minBeds) return false;
    if (filters.minBaths !== undefined && listing.baths < filters.minBaths) return false;
    if (filters.propertyType && listing.propertyType !== filters.propertyType) return false;
    if (filters.petsAllowed && listing.petPolicy.toLowerCase().includes("no pets")) return false;
    if (
      filters.availableBy &&
      new Date(listing.availableFrom).getTime() > new Date(filters.availableBy).getTime()
    ) {
      return false;
    }
    return true;
  });
}

export function getListingBySlug(slug: string): Listing | undefined {
  return listings.find((listing) => listing.slug === slug);
}

export function getFeaturedListings(limit = 3): Listing[] {
  return listings.slice(0, limit);
}

export function parseListingFiltersFromSearchParams(params: URLSearchParams): ListingFilters {
  const filters: ListingFilters = {};

  const minRentBDT = params.get("minRentBDT");
  const maxRentBDT = params.get("maxRentBDT");
  const area = params.get("area");
  const minBeds = params.get("minBeds");
  const minBaths = params.get("minBaths");
  const propertyType = params.get("propertyType");
  const petsAllowed = params.get("petsAllowed");
  const availableBy = params.get("availableBy");

  if (minRentBDT !== null) filters.minRentBDT = Number(minRentBDT);
  if (maxRentBDT !== null) filters.maxRentBDT = Number(maxRentBDT);
  if (area !== null) filters.area = area;
  if (minBeds !== null) filters.minBeds = Number(minBeds);
  if (minBaths !== null) filters.minBaths = Number(minBaths);
  if (propertyType !== null) filters.propertyType = propertyType as PropertyType;
  if (petsAllowed !== null) filters.petsAllowed = petsAllowed === "true";
  if (availableBy !== null) filters.availableBy = availableBy;

  return filters;
}
```

- [ ] **Step 8: Run test to verify it passes**

Run: `npx vitest run src/lib/listings-repository.test.ts`
Expected: PASS

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat: add listings repository, BDT formatting, and URL filter parsing"
```

---

## Task 6: Content repository

**Files:**
- Create: `src/lib/content-repository.ts`
- Test: `src/lib/content-repository.test.ts`

**Interfaces:**
- Consumes: `testimonials`, `teamMembers`, `propertyTypes` arrays from Task 4
- Produces: `getTestimonials(): Testimonial[]`; `getTeamMembers(): TeamMember[]`; `getAllPropertyTypes(): PropertyTypeInfo[]`; `getPropertyTypeInfo(type: string): PropertyTypeInfo | undefined`. Task 7, 13, 14 call these exclusively.

- [ ] **Step 1: Write the failing test**

Create `src/lib/content-repository.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import {
  getAllPropertyTypes,
  getPropertyTypeInfo,
  getTeamMembers,
  getTestimonials,
} from "./content-repository";

describe("content repository", () => {
  it("returns all testimonials", () => {
    expect(getTestimonials().length).toBeGreaterThanOrEqual(3);
  });

  it("returns all team members", () => {
    expect(getTeamMembers().length).toBeGreaterThanOrEqual(3);
  });

  it("returns all property types", () => {
    expect(getAllPropertyTypes()).toHaveLength(4);
  });

  it("returns info for a known property type", () => {
    expect(getPropertyTypeInfo("condo")?.title).toBe("Condos for Rent in Dhaka");
  });

  it("returns undefined for an unknown property type", () => {
    expect(getPropertyTypeInfo("mansion")).toBeUndefined();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/content-repository.test.ts`
Expected: FAIL — `./content-repository` does not exist.

- [ ] **Step 3: Implement the content repository**

Create `src/lib/content-repository.ts`:

```ts
import { testimonials } from "../data/testimonials";
import { teamMembers } from "../data/team";
import { propertyTypes } from "../data/propertyTypes";
import type { PropertyTypeInfo, TeamMember, Testimonial } from "../types";

export function getTestimonials(): Testimonial[] {
  return testimonials;
}

export function getTeamMembers(): TeamMember[] {
  return teamMembers;
}

export function getAllPropertyTypes(): PropertyTypeInfo[] {
  return propertyTypes;
}

export function getPropertyTypeInfo(type: string): PropertyTypeInfo | undefined {
  return propertyTypes.find((info) => info.type === type);
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/lib/content-repository.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add content repository for testimonials, team, and property types"
```

---

## Task 7: Home page

**Files:**
- Create: `src/components/ListingCard.tsx`
- Create: `src/components/HeroSearch.tsx`
- Create: `src/components/FeaturedListings.tsx`
- Create: `src/components/TrustSection.tsx`
- Modify: `src/pages/HomePage.tsx`
- Modify: `src/AppRoutes.test.tsx`
- Test: `src/components/ListingCard.test.tsx`
- Test: `src/components/HeroSearch.test.tsx`
- Test: `src/components/FeaturedListings.test.tsx`
- Test: `src/components/TrustSection.test.tsx`
- Test: `src/pages/HomePage.test.tsx`

**Interfaces:**
- Consumes: `getFeaturedListings` from Task 5, `Button`/`Input`/`Label`/`Card`/`CardContent` from Task 2, `formatBDT` from Task 5
- Produces: `ListingCard` (props: `{ listing: Listing }`) — reused by Task 8 and Task 7's own `FeaturedListings`; `HeroSearch` (navigates to `/listings?area=&propertyType=&maxRentBDT=`)

- [ ] **Step 1: Write the failing test for ListingCard**

Create `src/components/ListingCard.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { ListingCard } from "./ListingCard";
import type { Listing } from "../types";

const sampleListing: Listing = {
  id: "l1",
  slug: "gulshan-2-modern-apartment",
  title: "Modern 3-Bedroom Apartment in Gulshan 2",
  address: "House 14, Road 103, Gulshan 2",
  area: "Gulshan 2",
  rentBDT: 55000,
  depositBDT: 110000,
  beds: 3,
  baths: 2,
  sqft: 1600,
  availableFrom: "2026-11-01",
  propertyType: "apartment",
  petPolicy: "Cats and small dogs allowed",
  parking: "1 covered space",
  amenities: ["Generator backup"],
  utilitiesInfo: "Water included",
  leaseTerms: "12-month lease",
  photos: ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c"],
  lat: 23.7925,
  lng: 90.4078,
};

describe("ListingCard", () => {
  it("renders the listing title, formatted rent, and a link to its detail page", () => {
    render(
      <MemoryRouter>
        <ListingCard listing={sampleListing} />
      </MemoryRouter>
    );

    expect(screen.getByText(sampleListing.title)).toBeInTheDocument();
    expect(screen.getByText("৳55,000/mo")).toBeInTheDocument();
    expect(screen.getByText(/3 beds • 2 baths • 1600 sqft/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /view details/i })).toHaveAttribute(
      "href",
      "/listings/gulshan-2-modern-apartment"
    );
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/ListingCard.test.tsx`
Expected: FAIL — `./ListingCard` does not exist.

- [ ] **Step 3: Implement ListingCard**

Create `src/components/ListingCard.tsx`:

```tsx
import { Link } from "react-router-dom";
import type { Listing } from "../types";
import { formatBDT } from "../lib/format";
import { Card, CardContent } from "./ui/card";

export function ListingCard({ listing }: { listing: Listing }) {
  return (
    <Card>
      <img
        src={listing.photos[0]}
        alt={listing.title}
        className="h-48 w-full rounded-t-lg object-cover"
      />
      <CardContent>
        <h3 className="text-base font-semibold text-stone-900">{listing.title}</h3>
        <p className="text-sm text-stone-600">{listing.area}</p>
        <p className="mt-2 text-lg font-bold text-accent-700">
          {formatBDT(listing.rentBDT)}/mo
        </p>
        <p className="mt-1 text-sm text-stone-600">
          {listing.beds} beds • {listing.baths} baths • {listing.sqft} sqft
        </p>
        <Link
          to={`/listings/${listing.slug}`}
          className="mt-3 inline-block text-sm font-medium text-accent-600 underline"
        >
          View details
        </Link>
      </CardContent>
    </Card>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/components/ListingCard.test.tsx`
Expected: PASS

- [ ] **Step 5: Write the failing test for HeroSearch**

Create `src/components/HeroSearch.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes, useSearchParams } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { HeroSearch } from "./HeroSearch";

function ListingsStandIn() {
  const [params] = useSearchParams();
  return (
    <div>
      <p>Listings Page</p>
      <p data-testid="params">{params.toString()}</p>
    </div>
  );
}

describe("HeroSearch", () => {
  it("navigates to /listings with the chosen filters as query params", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route path="/" element={<HeroSearch />} />
          <Route path="/listings" element={<ListingsStandIn />} />
        </Routes>
      </MemoryRouter>
    );

    await user.type(screen.getByLabelText(/area/i), "Gulshan 2");
    await user.selectOptions(screen.getByLabelText(/property type/i), "apartment");
    await user.type(screen.getByLabelText(/max rent/i), "60000");
    await user.click(screen.getByRole("button", { name: /find a property/i }));

    expect(await screen.findByText("Listings Page")).toBeInTheDocument();
    expect(screen.getByTestId("params").textContent).toBe(
      "area=Gulshan+2&propertyType=apartment&maxRentBDT=60000"
    );
  });
});
```

- [ ] **Step 6: Run test to verify it fails**

Run: `npx vitest run src/components/HeroSearch.test.tsx`
Expected: FAIL — `./HeroSearch` does not exist.

- [ ] **Step 7: Implement HeroSearch**

Create `src/components/HeroSearch.tsx`:

```tsx
import { type FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

const PROPERTY_TYPES = [
  { value: "apartment", label: "Apartment" },
  { value: "single-family", label: "Single-Family Home" },
  { value: "condo", label: "Condo" },
  { value: "townhome", label: "Townhome" },
];

export function HeroSearch() {
  const navigate = useNavigate();
  const [area, setArea] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [maxRentBDT, setMaxRentBDT] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const params = new URLSearchParams();
    if (area) params.set("area", area);
    if (propertyType) params.set("propertyType", propertyType);
    if (maxRentBDT) params.set("maxRentBDT", maxRentBDT);
    navigate(`/listings?${params.toString()}`);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 rounded-lg bg-white p-6 shadow-md md:flex-row md:items-end"
    >
      <div className="flex-1">
        <Label htmlFor="hero-area">Area</Label>
        <Input
          id="hero-area"
          placeholder="e.g. Gulshan 2"
          value={area}
          onChange={(e) => setArea(e.target.value)}
        />
      </div>
      <div className="flex-1">
        <Label htmlFor="hero-property-type">Property type</Label>
        <select
          id="hero-property-type"
          value={propertyType}
          onChange={(e) => setPropertyType(e.target.value)}
          className="h-10 w-full rounded-md border border-stone-300 bg-white px-3 text-sm"
        >
          <option value="">Any</option>
          {PROPERTY_TYPES.map((pt) => (
            <option key={pt.value} value={pt.value}>
              {pt.label}
            </option>
          ))}
        </select>
      </div>
      <div className="flex-1">
        <Label htmlFor="hero-max-rent">Max rent (BDT)</Label>
        <Input
          id="hero-max-rent"
          type="number"
          placeholder="e.g. 60000"
          value={maxRentBDT}
          onChange={(e) => setMaxRentBDT(e.target.value)}
        />
      </div>
      <Button type="submit" size="lg">
        Find a Property
      </Button>
    </form>
  );
}
```

- [ ] **Step 8: Run test to verify it passes**

Run: `npx vitest run src/components/HeroSearch.test.tsx`
Expected: PASS

- [ ] **Step 9: Write the failing test for FeaturedListings**

Create `src/components/FeaturedListings.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { FeaturedListings } from "./FeaturedListings";

describe("FeaturedListings", () => {
  it("renders a heading and three featured listing cards", () => {
    render(
      <MemoryRouter>
        <FeaturedListings />
      </MemoryRouter>
    );

    expect(screen.getByRole("heading", { name: /featured listings/i })).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: /view details/i })).toHaveLength(3);
  });
});
```

- [ ] **Step 10: Run test to verify it fails**

Run: `npx vitest run src/components/FeaturedListings.test.tsx`
Expected: FAIL — `./FeaturedListings` does not exist.

- [ ] **Step 11: Implement FeaturedListings**

Create `src/components/FeaturedListings.tsx`:

```tsx
import { getFeaturedListings } from "../lib/listings-repository";
import { ListingCard } from "./ListingCard";

export function FeaturedListings() {
  const listings = getFeaturedListings(3);

  return (
    <section aria-labelledby="featured-heading" className="mx-auto max-w-6xl px-4 py-12">
      <h2 id="featured-heading" className="text-2xl font-bold text-stone-900">
        Featured Listings
      </h2>
      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {listings.map((listing) => (
          <ListingCard key={listing.id} listing={listing} />
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 12: Run test to verify it passes**

Run: `npx vitest run src/components/FeaturedListings.test.tsx`
Expected: PASS

- [ ] **Step 13: Write the failing test for TrustSection**

Create `src/components/TrustSection.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TrustSection } from "./TrustSection";

describe("TrustSection", () => {
  it("renders the trust heading and key stats", () => {
    render(<TrustSection />);
    expect(screen.getByRole("heading", { name: /why renters trust rent dhaka/i })).toBeInTheDocument();
    expect(screen.getByText(/years serving dhaka renters/i)).toBeInTheDocument();
    expect(screen.getByText(/verified properties managed/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 14: Run test to verify it fails**

Run: `npx vitest run src/components/TrustSection.test.tsx`
Expected: FAIL — `./TrustSection` does not exist.

- [ ] **Step 15: Implement TrustSection**

Create `src/components/TrustSection.tsx`:

```tsx
export function TrustSection() {
  return (
    <section aria-labelledby="trust-heading" className="bg-stone-50 px-4 py-12">
      <div className="mx-auto max-w-6xl text-center">
        <h2 id="trust-heading" className="text-2xl font-bold text-stone-900">
          Why Renters Trust Rent Dhaka
        </h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-3">
          <div>
            <p className="text-3xl font-bold text-accent-700">8+</p>
            <p className="mt-1 text-sm text-stone-600">Years serving Dhaka renters</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-accent-700">500+</p>
            <p className="mt-1 text-sm text-stone-600">Verified properties managed</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-accent-700">4.8/5</p>
            <p className="mt-1 text-sm text-stone-600">Average tenant satisfaction</p>
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 16: Run test to verify it passes**

Run: `npx vitest run src/components/TrustSection.test.tsx`
Expected: PASS

- [ ] **Step 17: Write the failing test for HomePage**

Create `src/pages/HomePage.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import HomePage from "./HomePage";

describe("HomePage", () => {
  it("renders the hero heading, search form, featured listings, and trust section", () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    expect(
      screen.getByRole("heading", {
        name: /better properties\. better management\. better living\./i,
      })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /find a property/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /featured listings/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /why renters trust rent dhaka/i })).toBeInTheDocument();
  });
});
```

- [ ] **Step 18: Run test to verify it fails**

Run: `npx vitest run src/pages/HomePage.test.tsx`
Expected: FAIL — `HomePage` still renders only the Task 3 stub heading.

- [ ] **Step 19: Implement the real HomePage**

Modify `src/pages/HomePage.tsx`:

```tsx
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
```

- [ ] **Step 20: Update the Task 3 route test for the new home heading**

Modify `src/AppRoutes.test.tsx` — replace the home test's assertion:

```tsx
  it("renders the home page at /", () => {
    renderAt("/");
    expect(
      screen.getByRole("heading", {
        name: /better properties\. better management\. better living\./i,
      })
    ).toBeInTheDocument();
  });
```

- [ ] **Step 21: Run the full test suite to verify everything passes**

Run: `npx vitest run`
Expected: PASS — all tests from Tasks 1-7 pass.

- [ ] **Step 22: Commit**

```bash
git add -A
git commit -m "feat: build real home page with hero search, featured listings, and trust section"
```

---

## Task 8: Listings search page — filters, list view, empty state

**Files:**
- Create: `src/components/ui/checkbox.tsx`
- Create: `src/components/ListingFilterSidebar.tsx`
- Create: `src/components/EmptyListingsState.tsx`
- Modify: `src/pages/ListingsPage.tsx`
- Modify: `src/AppRoutes.test.tsx`
- Test: `src/components/ui/checkbox.test.tsx`
- Test: `src/components/ListingFilterSidebar.test.tsx`
- Test: `src/components/EmptyListingsState.test.tsx`
- Test: `src/pages/ListingsPage.test.tsx`

**Interfaces:**
- Consumes: `getListings`, `parseListingFiltersFromSearchParams` from Task 5; `ListingCard` from Task 7; `Input`/`Label` from Task 2
- Produces: `Checkbox` primitive in `src/components/ui/checkbox.tsx`; `ListingFilterSidebar` (props: `{ filters: ListingFilters; onChange: (filters: ListingFilters) => void }`) and `EmptyListingsState`, both reused by Task 9.

- [ ] **Step 1: Write the failing test for Checkbox**

Create `src/components/ui/checkbox.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Checkbox } from "./checkbox";

describe("Checkbox", () => {
  it("calls onCheckedChange with true when toggled on", async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(<Checkbox aria-label="Pets allowed" checked={false} onCheckedChange={onCheckedChange} />);

    await user.click(screen.getByRole("checkbox", { name: /pets allowed/i }));
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/ui/checkbox.test.tsx`
Expected: FAIL — `./checkbox` does not exist.

- [ ] **Step 3: Implement Checkbox**

Create `src/components/ui/checkbox.tsx`:

```tsx
import { forwardRef, type ComponentPropsWithoutRef, type ElementRef } from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";
import { cn } from "../../lib/cn";

export const Checkbox = forwardRef<
  ElementRef<typeof CheckboxPrimitive.Root>,
  ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      "flex h-5 w-5 items-center justify-center rounded border border-stone-300 bg-white data-[state=checked]:border-accent-600 data-[state=checked]:bg-accent-600",
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator>
      <Check className="h-4 w-4 text-white" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = "Checkbox";
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/components/ui/checkbox.test.tsx`
Expected: PASS

- [ ] **Step 5: Write the failing test for ListingFilterSidebar**

Create `src/components/ListingFilterSidebar.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ListingFilterSidebar } from "./ListingFilterSidebar";

describe("ListingFilterSidebar", () => {
  it("reports an updated max rent filter", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<ListingFilterSidebar filters={{}} onChange={onChange} />);

    await user.type(screen.getByLabelText(/max rent/i), "60000");
    expect(onChange).toHaveBeenLastCalledWith({ maxRentBDT: 60000 });
  });

  it("reports an updated area filter", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<ListingFilterSidebar filters={{}} onChange={onChange} />);

    await user.type(screen.getByLabelText(/^area$/i), "Banani");
    expect(onChange).toHaveBeenLastCalledWith({ area: "Banani" });
  });

  it("reports an updated property type filter", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<ListingFilterSidebar filters={{}} onChange={onChange} />);

    await user.selectOptions(screen.getByLabelText(/property type/i), "condo");
    expect(onChange).toHaveBeenLastCalledWith({ propertyType: "condo" });
  });

  it("reports an updated pets-allowed filter", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<ListingFilterSidebar filters={{}} onChange={onChange} />);

    await user.click(screen.getByLabelText(/pets allowed/i));
    expect(onChange).toHaveBeenLastCalledWith({ petsAllowed: true });
  });

  it("removes a filter key when its value is cleared", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<ListingFilterSidebar filters={{ area: "Banani" }} onChange={onChange} />);

    await user.clear(screen.getByLabelText(/^area$/i));
    expect(onChange).toHaveBeenLastCalledWith({});
  });
});
```

- [ ] **Step 6: Run test to verify it fails**

Run: `npx vitest run src/components/ListingFilterSidebar.test.tsx`
Expected: FAIL — `./ListingFilterSidebar` does not exist.

- [ ] **Step 7: Implement ListingFilterSidebar**

Create `src/components/ListingFilterSidebar.tsx`:

```tsx
import type { ListingFilters, PropertyType } from "../types";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";

const PROPERTY_TYPES: { value: PropertyType; label: string }[] = [
  { value: "apartment", label: "Apartment" },
  { value: "single-family", label: "Single-Family Home" },
  { value: "condo", label: "Condo" },
  { value: "townhome", label: "Townhome" },
];

interface ListingFilterSidebarProps {
  filters: ListingFilters;
  onChange: (filters: ListingFilters) => void;
}

export function ListingFilterSidebar({ filters, onChange }: ListingFilterSidebarProps) {
  function update<K extends keyof ListingFilters>(key: K, value: ListingFilters[K] | undefined) {
    const next: ListingFilters = { ...filters };
    if (value === undefined) {
      delete next[key];
    } else {
      next[key] = value;
    }
    onChange(next);
  }

  return (
    <aside
      aria-label="Filter listings"
      className="w-full space-y-4 rounded-lg border border-stone-200 p-4 md:w-64"
    >
      <div>
        <Label htmlFor="filter-min-rent">Min rent (BDT)</Label>
        <Input
          id="filter-min-rent"
          type="number"
          value={filters.minRentBDT ?? ""}
          onChange={(e) =>
            update("minRentBDT", e.target.value ? Number(e.target.value) : undefined)
          }
        />
      </div>
      <div>
        <Label htmlFor="filter-max-rent">Max rent (BDT)</Label>
        <Input
          id="filter-max-rent"
          type="number"
          value={filters.maxRentBDT ?? ""}
          onChange={(e) =>
            update("maxRentBDT", e.target.value ? Number(e.target.value) : undefined)
          }
        />
      </div>
      <div>
        <Label htmlFor="filter-area">Area</Label>
        <Input
          id="filter-area"
          value={filters.area ?? ""}
          onChange={(e) => update("area", e.target.value || undefined)}
        />
      </div>
      <div>
        <Label htmlFor="filter-min-beds">Min beds</Label>
        <select
          id="filter-min-beds"
          value={filters.minBeds ?? ""}
          onChange={(e) => update("minBeds", e.target.value ? Number(e.target.value) : undefined)}
          className="h-10 w-full rounded-md border border-stone-300 bg-white px-3 text-sm"
        >
          <option value="">Any</option>
          {[1, 2, 3, 4, 5].map((n) => (
            <option key={n} value={n}>
              {n}+
            </option>
          ))}
        </select>
      </div>
      <div>
        <Label htmlFor="filter-min-baths">Min baths</Label>
        <select
          id="filter-min-baths"
          value={filters.minBaths ?? ""}
          onChange={(e) => update("minBaths", e.target.value ? Number(e.target.value) : undefined)}
          className="h-10 w-full rounded-md border border-stone-300 bg-white px-3 text-sm"
        >
          <option value="">Any</option>
          {[1, 2, 3, 4, 5].map((n) => (
            <option key={n} value={n}>
              {n}+
            </option>
          ))}
        </select>
      </div>
      <div>
        <Label htmlFor="filter-property-type">Property type</Label>
        <select
          id="filter-property-type"
          value={filters.propertyType ?? ""}
          onChange={(e) =>
            update("propertyType", (e.target.value || undefined) as PropertyType | undefined)
          }
          className="h-10 w-full rounded-md border border-stone-300 bg-white px-3 text-sm"
        >
          <option value="">Any</option>
          {PROPERTY_TYPES.map((pt) => (
            <option key={pt.value} value={pt.value}>
              {pt.label}
            </option>
          ))}
        </select>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox
          id="filter-pets-allowed"
          checked={filters.petsAllowed ?? false}
          onCheckedChange={(checked) => update("petsAllowed", checked === true ? true : undefined)}
        />
        <Label htmlFor="filter-pets-allowed">Pets allowed</Label>
      </div>
    </aside>
  );
}
```

- [ ] **Step 8: Run test to verify it passes**

Run: `npx vitest run src/components/ListingFilterSidebar.test.tsx`
Expected: PASS

- [ ] **Step 9: Write the failing test for EmptyListingsState**

Create `src/components/EmptyListingsState.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { EmptyListingsState } from "./EmptyListingsState";

describe("EmptyListingsState", () => {
  it("renders a status message explaining there are no matches", () => {
    render(<EmptyListingsState />);
    expect(screen.getByRole("status")).toHaveTextContent(/no listings match your filters/i);
  });
});
```

- [ ] **Step 10: Run test to verify it fails**

Run: `npx vitest run src/components/EmptyListingsState.test.tsx`
Expected: FAIL — `./EmptyListingsState` does not exist.

- [ ] **Step 11: Implement EmptyListingsState**

Create `src/components/EmptyListingsState.tsx`:

```tsx
export function EmptyListingsState() {
  return (
    <div
      role="status"
      className="rounded-lg border border-dashed border-stone-300 p-8 text-center text-stone-600"
    >
      <p className="font-medium">No listings match your filters.</p>
      <p className="mt-1 text-sm">Try widening your rent range or clearing a filter.</p>
    </div>
  );
}
```

- [ ] **Step 12: Run test to verify it passes**

Run: `npx vitest run src/components/EmptyListingsState.test.tsx`
Expected: PASS

- [ ] **Step 13: Write the failing test for ListingsPage**

Create `src/pages/ListingsPage.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import ListingsPage from "./ListingsPage";

describe("ListingsPage", () => {
  it("renders only listings matching the filters in the URL", () => {
    render(
      <MemoryRouter initialEntries={["/listings?propertyType=condo"]}>
        <ListingsPage />
      </MemoryRouter>
    );

    expect(screen.getByRole("heading", { name: /^listings$/i })).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: /view details/i })).toHaveLength(2);
  });

  it("shows an empty state when no listing matches the filters", () => {
    render(
      <MemoryRouter initialEntries={["/listings?minRentBDT=999999999"]}>
        <ListingsPage />
      </MemoryRouter>
    );

    expect(screen.getByRole("status")).toHaveTextContent(/no listings match your filters/i);
  });

  it("narrows the results when a filter is changed through the sidebar", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={["/listings"]}>
        <ListingsPage />
      </MemoryRouter>
    );

    await user.type(screen.getByLabelText(/^area$/i), "Banani");

    expect(screen.getByText("Executive 3-Bedroom Condo in Banani")).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: /view details/i })).toHaveLength(1);
  });
});
```

- [ ] **Step 14: Run test to verify it fails**

Run: `npx vitest run src/pages/ListingsPage.test.tsx`
Expected: FAIL — `ListingsPage` still renders only the Task 3 stub heading.

- [ ] **Step 15: Implement the real ListingsPage**

Modify `src/pages/ListingsPage.tsx`:

```tsx
import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { getListings, parseListingFiltersFromSearchParams } from "../lib/listings-repository";
import { ListingCard } from "../components/ListingCard";
import { ListingFilterSidebar } from "../components/ListingFilterSidebar";
import { EmptyListingsState } from "../components/EmptyListingsState";
import type { ListingFilters } from "../types";

export default function ListingsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const filters = useMemo(() => parseListingFiltersFromSearchParams(searchParams), [searchParams]);
  const listings = useMemo(() => getListings(filters), [filters]);

  function handleFiltersChange(next: ListingFilters) {
    const params = new URLSearchParams();
    Object.entries(next).forEach(([key, value]) => {
      if (value !== undefined) params.set(key, String(value));
    });
    setSearchParams(params);
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-bold text-stone-900">Listings</h1>
      <div className="mt-6 flex flex-col gap-6 md:flex-row">
        <ListingFilterSidebar filters={filters} onChange={handleFiltersChange} />
        <div className="flex-1">
          {listings.length === 0 ? (
            <EmptyListingsState />
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {listings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 16: Update the Task 3 route test for the new listings heading**

Modify `src/AppRoutes.test.tsx` — the listings test already expects a heading named `/listings/i`, which still matches "Listings"; no change needed. Run the full suite in the next step to confirm.

- [ ] **Step 17: Run the full test suite to verify everything passes**

Run: `npx vitest run`
Expected: PASS — all tests from Tasks 1-8 pass.

- [ ] **Step 18: Commit**

```bash
git add -A
git commit -m "feat: build listings search page with filters, list view, and empty state"
```

---

## Task 9: Listings map view toggle (Leaflet)

**Files:**
- Create: `src/components/ListingsMapView.tsx`
- Modify: `src/pages/ListingsPage.tsx`
- Modify: `src/main.tsx`
- Test: `src/components/ListingsMapView.test.tsx`
- Modify: `src/pages/ListingsPage.test.tsx`

**Interfaces:**
- Consumes: `Listing` type from Task 4, `formatBDT` from Task 5, `Button` from Task 2
- Produces: `ListingsMapView` (props: `{ listings: Listing[] }`), wired into `ListingsPage` behind a List/Map toggle. Tests mock `react-leaflet` so no real map/DOM APIs are needed under jsdom.

- [ ] **Step 1: Write the failing test**

Create `src/components/ListingsMapView.test.tsx`:

```tsx
import type { ReactNode } from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { ListingsMapView } from "./ListingsMapView";
import type { Listing } from "../types";

vi.mock("react-leaflet", () => ({
  MapContainer: ({ children }: { children: ReactNode }) => (
    <div data-testid="map-container">{children}</div>
  ),
  TileLayer: () => <div data-testid="tile-layer" />,
  Marker: ({ children }: { children?: ReactNode }) => <div data-testid="marker">{children}</div>,
  Popup: ({ children }: { children: ReactNode }) => <div data-testid="popup">{children}</div>,
}));

const sampleListings: Listing[] = [
  {
    id: "l1",
    slug: "gulshan-2-modern-apartment",
    title: "Modern 3-Bedroom Apartment in Gulshan 2",
    address: "House 14, Road 103, Gulshan 2",
    area: "Gulshan 2",
    rentBDT: 55000,
    depositBDT: 110000,
    beds: 3,
    baths: 2,
    sqft: 1600,
    availableFrom: "2026-11-01",
    propertyType: "apartment",
    petPolicy: "Cats and small dogs allowed",
    parking: "1 covered space",
    amenities: ["Generator backup"],
    utilitiesInfo: "Water included",
    leaseTerms: "12-month lease",
    photos: ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c"],
    lat: 23.7925,
    lng: 90.4078,
  },
  {
    id: "l3",
    slug: "banani-executive-condo",
    title: "Executive 3-Bedroom Condo in Banani",
    address: "Road 11, Banani",
    area: "Banani",
    rentBDT: 85000,
    depositBDT: 170000,
    beds: 3,
    baths: 3,
    sqft: 1850,
    availableFrom: "2026-11-15",
    propertyType: "condo",
    petPolicy: "Cats only",
    parking: "1 covered space",
    amenities: ["Swimming pool"],
    utilitiesInfo: "Service charge included",
    leaseTerms: "12-month lease",
    photos: ["https://images.unsplash.com/photo-1600210492486-724fe5c67fb0"],
    lat: 23.7937,
    lng: 90.4066,
  },
];

describe("ListingsMapView", () => {
  it("renders one marker per listing", () => {
    render(
      <MemoryRouter>
        <ListingsMapView listings={sampleListings} />
      </MemoryRouter>
    );

    expect(screen.getByTestId("map-container")).toBeInTheDocument();
    expect(screen.getAllByTestId("marker")).toHaveLength(2);
    expect(screen.getByText("Modern 3-Bedroom Apartment in Gulshan 2")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/ListingsMapView.test.tsx`
Expected: FAIL — `./ListingsMapView` does not exist.

- [ ] **Step 3: Implement ListingsMapView**

Modify `src/main.tsx` to load Leaflet's stylesheet once, globally:

```tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "leaflet/dist/leaflet.css";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

Create `src/components/ListingsMapView.tsx`:

```tsx
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { Link } from "react-router-dom";
import type { Listing } from "../types";
import { formatBDT } from "../lib/format";

const DHAKA_CENTER: [number, number] = [23.8103, 90.4125];

export function ListingsMapView({ listings }: { listings: Listing[] }) {
  return (
    <MapContainer center={DHAKA_CENTER} zoom={12} style={{ height: "500px", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {listings.map((listing) => (
        <Marker key={listing.id} position={[listing.lat, listing.lng]}>
          <Popup>
            <p className="font-semibold">{listing.title}</p>
            <p>{formatBDT(listing.rentBDT)}/mo</p>
            <Link to={`/listings/${listing.slug}`}>View details</Link>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/components/ListingsMapView.test.tsx`
Expected: PASS

- [ ] **Step 5: Write the failing test for the List/Map toggle on ListingsPage**

Modify `src/pages/ListingsPage.test.tsx` to mock `react-leaflet` and add a toggle test:

```tsx
import type { ReactNode } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import ListingsPage from "./ListingsPage";

vi.mock("react-leaflet", () => ({
  MapContainer: ({ children }: { children: ReactNode }) => (
    <div data-testid="map-container">{children}</div>
  ),
  TileLayer: () => <div data-testid="tile-layer" />,
  Marker: ({ children }: { children?: ReactNode }) => <div data-testid="marker">{children}</div>,
  Popup: ({ children }: { children: ReactNode }) => <div data-testid="popup">{children}</div>,
}));

describe("ListingsPage", () => {
  it("renders only listings matching the filters in the URL", () => {
    render(
      <MemoryRouter initialEntries={["/listings?propertyType=condo"]}>
        <ListingsPage />
      </MemoryRouter>
    );

    expect(screen.getByRole("heading", { name: /^listings$/i })).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: /view details/i })).toHaveLength(2);
  });

  it("shows an empty state when no listing matches the filters", () => {
    render(
      <MemoryRouter initialEntries={["/listings?minRentBDT=999999999"]}>
        <ListingsPage />
      </MemoryRouter>
    );

    expect(screen.getByRole("status")).toHaveTextContent(/no listings match your filters/i);
  });

  it("narrows the results when a filter is changed through the sidebar", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={["/listings"]}>
        <ListingsPage />
      </MemoryRouter>
    );

    await user.type(screen.getByLabelText(/^area$/i), "Banani");

    expect(screen.getByText("Executive 3-Bedroom Condo in Banani")).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: /view details/i })).toHaveLength(1);
  });

  it("toggles to map view and renders a marker per listing", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={["/listings?propertyType=condo"]}>
        <ListingsPage />
      </MemoryRouter>
    );

    await user.click(screen.getByRole("button", { name: /^map$/i }));

    expect(screen.getByTestId("map-container")).toBeInTheDocument();
    expect(screen.getAllByTestId("marker")).toHaveLength(2);
  });
});
```

- [ ] **Step 6: Run test to verify it fails**

Run: `npx vitest run src/pages/ListingsPage.test.tsx`
Expected: FAIL — no "Map" button exists yet.

- [ ] **Step 7: Add the List/Map toggle to ListingsPage**

Modify `src/pages/ListingsPage.tsx`:

```tsx
import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getListings, parseListingFiltersFromSearchParams } from "../lib/listings-repository";
import { ListingCard } from "../components/ListingCard";
import { ListingFilterSidebar } from "../components/ListingFilterSidebar";
import { ListingsMapView } from "../components/ListingsMapView";
import { EmptyListingsState } from "../components/EmptyListingsState";
import { Button } from "../components/ui/button";
import type { ListingFilters } from "../types";

export default function ListingsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [view, setView] = useState<"list" | "map">("list");
  const filters = useMemo(() => parseListingFiltersFromSearchParams(searchParams), [searchParams]);
  const listings = useMemo(() => getListings(filters), [filters]);

  function handleFiltersChange(next: ListingFilters) {
    const params = new URLSearchParams();
    Object.entries(next).forEach(([key, value]) => {
      if (value !== undefined) params.set(key, String(value));
    });
    setSearchParams(params);
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-stone-900">Listings</h1>
        <div role="group" aria-label="View toggle" className="flex gap-2">
          <Button
            variant={view === "list" ? "primary" : "outline"}
            size="sm"
            onClick={() => setView("list")}
          >
            List
          </Button>
          <Button
            variant={view === "map" ? "primary" : "outline"}
            size="sm"
            onClick={() => setView("map")}
          >
            Map
          </Button>
        </div>
      </div>
      <div className="mt-6 flex flex-col gap-6 md:flex-row">
        <ListingFilterSidebar filters={filters} onChange={handleFiltersChange} />
        <div className="flex-1">
          {listings.length === 0 ? (
            <EmptyListingsState />
          ) : view === "list" ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {listings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          ) : (
            <ListingsMapView listings={listings} />
          )}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 8: Run the full test suite to verify everything passes**

Run: `npx vitest run`
Expected: PASS — all tests from Tasks 1-9 pass.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat: add Leaflet-based map view toggle to listings page"
```

---

## Task 10: Property detail page

**Files:**
- Create: `src/components/NotFoundMessage.tsx`
- Create: `src/components/PhotoGallery.tsx`
- Create: `src/components/StickyApplyBar.tsx`
- Modify: `src/pages/ListingDetailPage.tsx`
- Test: `src/components/NotFoundMessage.test.tsx`
- Test: `src/components/PhotoGallery.test.tsx`
- Test: `src/components/StickyApplyBar.test.tsx`
- Test: `src/pages/ListingDetailPage.test.tsx`

**Interfaces:**
- Consumes: `getListingBySlug`, `formatBDT` from Task 5; `ListingsMapView` from Task 9
- Produces: `NotFoundMessage` (props: `{ heading: string; message: string }`) — reused by Task 13; `PhotoGallery` (props: `{ photos: string[]; alt: string }`); `StickyApplyBar` (props: `{ listingSlug: string }`)

- [ ] **Step 1: Write the failing test for NotFoundMessage**

Create `src/components/NotFoundMessage.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { NotFoundMessage } from "./NotFoundMessage";

describe("NotFoundMessage", () => {
  it("renders the given heading and message", () => {
    render(<NotFoundMessage heading="Listing not found" message="It may have been removed." />);
    expect(screen.getByRole("heading", { name: /listing not found/i })).toBeInTheDocument();
    expect(screen.getByText("It may have been removed.")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/NotFoundMessage.test.tsx`
Expected: FAIL — `./NotFoundMessage` does not exist.

- [ ] **Step 3: Implement NotFoundMessage**

Create `src/components/NotFoundMessage.tsx`:

```tsx
export function NotFoundMessage({ heading, message }: { heading: string; message: string }) {
  return (
    <div className="mx-auto max-w-xl px-4 py-16 text-center">
      <h1 className="text-2xl font-bold text-stone-900">{heading}</h1>
      <p className="mt-2 text-stone-600">{message}</p>
    </div>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/components/NotFoundMessage.test.tsx`
Expected: PASS

- [ ] **Step 5: Write the failing test for PhotoGallery**

Create `src/components/PhotoGallery.test.tsx`:

```tsx
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { PhotoGallery } from "./PhotoGallery";

const photos = [
  "https://example.com/1.jpg",
  "https://example.com/2.jpg",
  "https://example.com/3.jpg",
];

describe("PhotoGallery", () => {
  it("starts on the first photo and advances with the next button", async () => {
    const user = userEvent.setup();
    render(<PhotoGallery photos={photos} alt="Sample listing" />);

    expect(screen.getByAltText(/photo 1 of 3/i)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /next photo/i }));
    expect(screen.getByAltText(/photo 2 of 3/i)).toBeInTheDocument();
  });

  it("supports left/right arrow keys when the gallery is focused", async () => {
    const user = userEvent.setup();
    render(<PhotoGallery photos={photos} alt="Sample listing" />);

    screen.getByRole("group", { name: /photo gallery/i }).focus();
    await user.keyboard("{ArrowRight}{ArrowRight}");
    expect(screen.getByAltText(/photo 3 of 3/i)).toBeInTheDocument();

    await user.keyboard("{ArrowLeft}");
    expect(screen.getByAltText(/photo 2 of 3/i)).toBeInTheDocument();
  });

  it("advances on a left swipe and goes back on a right swipe", () => {
    render(<PhotoGallery photos={photos} alt="Sample listing" />);
    const gallery = screen.getByRole("group", { name: /photo gallery/i });

    fireEvent.touchStart(gallery, { touches: [{ clientX: 200 }] });
    fireEvent.touchEnd(gallery, { changedTouches: [{ clientX: 50 }] });
    expect(screen.getByAltText(/photo 2 of 3/i)).toBeInTheDocument();

    fireEvent.touchStart(gallery, { touches: [{ clientX: 50 }] });
    fireEvent.touchEnd(gallery, { changedTouches: [{ clientX: 200 }] });
    expect(screen.getByAltText(/photo 1 of 3/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 6: Run test to verify it fails**

Run: `npx vitest run src/components/PhotoGallery.test.tsx`
Expected: FAIL — `./PhotoGallery` does not exist.

- [ ] **Step 7: Implement PhotoGallery**

Create `src/components/PhotoGallery.tsx`:

```tsx
import { useState, type KeyboardEvent, type TouchEvent } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const SWIPE_THRESHOLD_PX = 50;

export function PhotoGallery({ photos, alt }: { photos: string[]; alt: string }) {
  const [index, setIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  function goPrev() {
    setIndex((i) => (i - 1 + photos.length) % photos.length);
  }

  function goNext() {
    setIndex((i) => (i + 1) % photos.length);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "ArrowLeft") goPrev();
    if (event.key === "ArrowRight") goNext();
  }

  function handleTouchStart(event: TouchEvent<HTMLDivElement>) {
    setTouchStartX(event.touches[0].clientX);
  }

  function handleTouchEnd(event: TouchEvent<HTMLDivElement>) {
    if (touchStartX === null) return;
    const deltaX = event.changedTouches[0].clientX - touchStartX;
    if (deltaX <= -SWIPE_THRESHOLD_PX) goNext();
    if (deltaX >= SWIPE_THRESHOLD_PX) goPrev();
    setTouchStartX(null);
  }

  return (
    <div
      role="group"
      aria-label="Photo gallery"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500"
    >
      <img
        src={photos[index]}
        alt={`${alt} photo ${index + 1} of ${photos.length}`}
        className="h-96 w-full rounded-lg object-cover"
      />
      {photos.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous photo"
            onClick={goPrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            aria-label="Next photo"
            onClick={goNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}
      <div className="mt-2 flex gap-2">
        {photos.map((photo, i) => (
          <button
            key={photo}
            type="button"
            aria-label={`Show photo ${i + 1}`}
            aria-current={i === index}
            onClick={() => setIndex(i)}
            className={`h-2 w-2 rounded-full ${i === index ? "bg-accent-600" : "bg-stone-300"}`}
          />
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 8: Run test to verify it passes**

Run: `npx vitest run src/components/PhotoGallery.test.tsx`
Expected: PASS

- [ ] **Step 9: Write the failing test for StickyApplyBar**

Create `src/components/StickyApplyBar.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { StickyApplyBar } from "./StickyApplyBar";

describe("StickyApplyBar", () => {
  it("renders a focusable Apply Now link to the application page", () => {
    render(
      <MemoryRouter>
        <StickyApplyBar listingSlug="gulshan-2-modern-apartment" />
      </MemoryRouter>
    );

    const link = screen.getByRole("link", { name: /apply now/i });
    expect(link).toHaveAttribute("href", "/apply/gulshan-2-modern-apartment");
    expect(link).not.toHaveAttribute("aria-hidden", "true");
    expect(link).not.toHaveAttribute("tabindex", "-1");
  });
});
```

- [ ] **Step 10: Run test to verify it fails**

Run: `npx vitest run src/components/StickyApplyBar.test.tsx`
Expected: FAIL — `./StickyApplyBar` does not exist.

- [ ] **Step 11: Implement StickyApplyBar**

Create `src/components/StickyApplyBar.tsx`:

```tsx
import { Link } from "react-router-dom";

export function StickyApplyBar({ listingSlug }: { listingSlug: string }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-stone-200 bg-white p-3 md:hidden">
      <Link
        to={`/apply/${listingSlug}`}
        className="flex h-12 w-full items-center justify-center rounded-md bg-accent-600 text-base font-medium text-white"
      >
        Apply Now
      </Link>
    </div>
  );
}
```

- [ ] **Step 12: Run test to verify it passes**

Run: `npx vitest run src/components/StickyApplyBar.test.tsx`
Expected: PASS

- [ ] **Step 13: Write the failing test for ListingDetailPage**

Create `src/pages/ListingDetailPage.test.tsx`:

```tsx
import type { ReactNode } from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import ListingDetailPage from "./ListingDetailPage";

vi.mock("react-leaflet", () => ({
  MapContainer: ({ children }: { children: ReactNode }) => (
    <div data-testid="map-container">{children}</div>
  ),
  TileLayer: () => <div data-testid="tile-layer" />,
  Marker: ({ children }: { children?: ReactNode }) => <div data-testid="marker">{children}</div>,
  Popup: ({ children }: { children: ReactNode }) => <div data-testid="popup">{children}</div>,
}));

function renderAt(path: string) {
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/listings/:slug" element={<ListingDetailPage />} />
      </Routes>
    </MemoryRouter>
  );
}

describe("ListingDetailPage", () => {
  it("renders listing details, amenities, map, and the apply link for a valid slug", () => {
    renderAt("/listings/gulshan-2-modern-apartment");

    expect(
      screen.getByRole("heading", { name: /modern 3-bedroom apartment in gulshan 2/i })
    ).toBeInTheDocument();
    expect(screen.getByText("৳55,000/mo")).toBeInTheDocument();
    expect(screen.getByText(/generator backup/i)).toBeInTheDocument();
    expect(screen.getByTestId("map-container")).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: /apply now/i }).length).toBeGreaterThan(0);
  });

  it("shows a not-found message for an unknown slug", () => {
    renderAt("/listings/does-not-exist");

    expect(screen.getByRole("heading", { name: /listing not found/i })).toBeInTheDocument();
  });
});
```

- [ ] **Step 14: Run test to verify it fails**

Run: `npx vitest run src/pages/ListingDetailPage.test.tsx`
Expected: FAIL — `ListingDetailPage` still renders only the Task 3 stub heading.

- [ ] **Step 15: Implement the real ListingDetailPage**

Modify `src/pages/ListingDetailPage.tsx`:

```tsx
import { Link, useParams } from "react-router-dom";
import { getListingBySlug } from "../lib/listings-repository";
import { formatBDT } from "../lib/format";
import { PhotoGallery } from "../components/PhotoGallery";
import { StickyApplyBar } from "../components/StickyApplyBar";
import { NotFoundMessage } from "../components/NotFoundMessage";
import { ListingsMapView } from "../components/ListingsMapView";

export default function ListingDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const listing = slug ? getListingBySlug(slug) : undefined;

  if (!listing) {
    return (
      <NotFoundMessage
        heading="Listing not found"
        message="This listing may have been rented or removed. Browse current listings instead."
      />
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 pb-24 md:pb-8">
      <h1 className="text-2xl font-bold text-stone-900">{listing.title}</h1>
      <p className="mt-1 text-stone-600">{listing.address}</p>

      <div className="mt-6">
        <PhotoGallery photos={listing.photos} alt={listing.title} />
      </div>

      <div className="mt-6 flex flex-wrap gap-6 border-y border-stone-200 py-4 text-stone-700">
        <p className="text-xl font-bold text-accent-700">{formatBDT(listing.rentBDT)}/mo</p>
        <p>{listing.beds} beds</p>
        <p>{listing.baths} baths</p>
        <p>{listing.sqft} sqft</p>
        <p>Deposit: {formatBDT(listing.depositBDT)}</p>
      </div>

      <section className="mt-6">
        <h2 className="text-lg font-semibold text-stone-900">Amenities</h2>
        <ul className="mt-2 grid grid-cols-2 gap-1 text-sm text-stone-700">
          {listing.amenities.map((amenity) => (
            <li key={amenity}>• {amenity}</li>
          ))}
        </ul>
      </section>

      <section className="mt-6 text-sm text-stone-700">
        <h2 className="text-lg font-semibold text-stone-900">Details</h2>
        <p className="mt-2">Pet policy: {listing.petPolicy}</p>
        <p className="mt-1">Parking: {listing.parking}</p>
        <p className="mt-1">Utilities: {listing.utilitiesInfo}</p>
        <p className="mt-1">Lease terms: {listing.leaseTerms}</p>
      </section>

      <section className="mt-6">
        <h2 className="text-lg font-semibold text-stone-900">Location</h2>
        <div className="mt-2">
          <ListingsMapView listings={[listing]} />
        </div>
      </section>

      <div className="mt-8 hidden gap-3 md:flex">
        <Link
          to={`/apply/${listing.slug}`}
          className="rounded-md bg-accent-600 px-6 py-3 text-sm font-medium text-white"
        >
          Apply Now
        </Link>
      </div>

      <StickyApplyBar listingSlug={listing.slug} />
    </div>
  );
}
```

- [ ] **Step 16: Update the Task 3 route test for the new listing detail heading**

Modify `src/AppRoutes.test.tsx` — the stub-era test used a nonexistent slug and matched the stub heading; replace it with a real slug and the real heading it now renders:

```tsx
  it("renders the listing detail page at /listings/:slug", () => {
    renderAt("/listings/gulshan-2-modern-apartment");
    expect(
      screen.getByRole("heading", { name: /modern 3-bedroom apartment in gulshan 2/i })
    ).toBeInTheDocument();
  });
```

This test file does not yet mock `react-leaflet`, and `ListingDetailPage` now renders `ListingsMapView`. Add the mock near the top of `src/AppRoutes.test.tsx`, alongside its existing imports:

```tsx
import type { ReactNode } from "react";
import { vi } from "vitest";

vi.mock("react-leaflet", () => ({
  MapContainer: ({ children }: { children: ReactNode }) => (
    <div data-testid="map-container">{children}</div>
  ),
  TileLayer: () => <div data-testid="tile-layer" />,
  Marker: ({ children }: { children?: ReactNode }) => <div data-testid="marker">{children}</div>,
  Popup: ({ children }: { children: ReactNode }) => <div data-testid="popup">{children}</div>,
}));
```

- [ ] **Step 17: Run the full test suite to verify everything passes**

Run: `npx vitest run`
Expected: PASS — all tests from Tasks 1-10 pass.

- [ ] **Step 18: Commit**

```bash
git add -A
git commit -m "feat: build property detail page with gallery, map, and sticky apply bar"
```

---

## Task 11: Schedule Tour modal (Netlify Forms)

**Files:**
- Create: `src/components/ui/dialog.tsx`
- Create: `src/components/ui/textarea.tsx`
- Create: `src/lib/netlify-forms.ts`
- Create: `src/components/ScheduleTourModal.tsx`
- Modify: `index.html`
- Modify: `src/pages/ListingDetailPage.tsx`
- Modify: `src/pages/ListingDetailPage.test.tsx`
- Test: `src/components/ui/dialog.test.tsx`
- Test: `src/lib/netlify-forms.test.ts`
- Test: `src/components/ScheduleTourModal.test.tsx`

**Interfaces:**
- Consumes: `Button`, `Input`, `Label` from Task 2
- Produces: `Dialog`/`DialogContent`/`DialogTitle` in `src/components/ui/dialog.tsx`; `Textarea` in `src/components/ui/textarea.tsx`; `submitTourRequest(fields: TourRequestFields): Promise<void>` in `src/lib/netlify-forms.ts` (Task 12 adds `submitApplication` to the same file); `ScheduleTourModal` (props: `{ listingSlug: string; open: boolean; onOpenChange: (open: boolean) => void }`), wired into `ListingDetailPage` via a "Schedule Tour" button.

- [ ] **Step 1: Write the failing test for Dialog**

Create `src/components/ui/dialog.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Dialog, DialogContent, DialogTitle } from "./dialog";

describe("Dialog", () => {
  it("renders its content when open and calls onOpenChange(false) when closed", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <Dialog open onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogTitle>Schedule a Tour</DialogTitle>
          <p>Body content</p>
        </DialogContent>
      </Dialog>
    );

    expect(screen.getByText("Schedule a Tour")).toBeInTheDocument();
    expect(screen.getByText("Body content")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /close/i }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/ui/dialog.test.tsx`
Expected: FAIL — `./dialog` does not exist.

- [ ] **Step 3: Implement Dialog and Textarea**

Create `src/components/ui/dialog.tsx`:

```tsx
import { forwardRef, type ComponentPropsWithoutRef, type ElementRef } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "../../lib/cn";

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;

export const DialogContent = forwardRef<
  ElementRef<typeof DialogPrimitive.Content>,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPrimitive.Portal>
    <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/50" />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-lg",
        className
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close
        aria-label="Close"
        className="absolute right-4 top-4 rounded-md p-1 hover:bg-stone-100"
      >
        <X className="h-4 w-4" />
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPrimitive.Portal>
));
DialogContent.displayName = "DialogContent";

export function DialogTitle({
  className,
  ...props
}: ComponentPropsWithoutRef<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title className={cn("text-lg font-semibold text-stone-900", className)} {...props} />
  );
}
```

Create `src/components/ui/textarea.tsx`:

```tsx
import { forwardRef, type TextareaHTMLAttributes } from "react";
import { cn } from "../../lib/cn";

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        "w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500",
        className
      )}
      {...props}
    />
  )
);
Textarea.displayName = "Textarea";
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/components/ui/dialog.test.tsx`
Expected: PASS

- [ ] **Step 5: Write the failing test for submitTourRequest**

Create `src/lib/netlify-forms.test.ts`:

```ts
import { beforeEach, describe, expect, it, vi } from "vitest";
import { submitTourRequest } from "./netlify-forms";

describe("submitTourRequest", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("POSTs url-encoded form data including the form-name field", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal("fetch", fetchMock);

    await submitTourRequest({
      listingSlug: "gulshan-2-modern-apartment",
      name: "Rafiq Ahmed",
      phone: "01711000000",
      email: "rafiq@example.com",
      preferredDate: "2026-11-05",
      message: "Interested in a weekend tour",
    });

    expect(fetchMock).toHaveBeenCalledWith("/", expect.objectContaining({ method: "POST" }));
    const body = fetchMock.mock.calls[0][1].body as string;
    const params = new URLSearchParams(body);
    expect(params.get("form-name")).toBe("tour-request");
    expect(params.get("listingSlug")).toBe("gulshan-2-modern-apartment");
    expect(params.get("name")).toBe("Rafiq Ahmed");
  });

  it("throws when the response is not ok", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false }));

    await expect(
      submitTourRequest({
        listingSlug: "gulshan-2-modern-apartment",
        name: "Rafiq Ahmed",
        phone: "01711000000",
        email: "rafiq@example.com",
        preferredDate: "2026-11-05",
        message: "",
      })
    ).rejects.toThrow("Tour request submission failed");
  });
});
```

- [ ] **Step 6: Run test to verify it fails**

Run: `npx vitest run src/lib/netlify-forms.test.ts`
Expected: FAIL — `./netlify-forms` does not exist.

- [ ] **Step 7: Implement submitTourRequest**

Create `src/lib/netlify-forms.ts`:

```ts
export interface TourRequestFields {
  listingSlug: string;
  name: string;
  phone: string;
  email: string;
  preferredDate: string;
  message: string;
}

export async function submitTourRequest(fields: TourRequestFields): Promise<void> {
  const body = new URLSearchParams({ "form-name": "tour-request", ...fields }).toString();
  const response = await fetch("/", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  if (!response.ok) {
    throw new Error("Tour request submission failed");
  }
}
```

- [ ] **Step 8: Run test to verify it passes**

Run: `npx vitest run src/lib/netlify-forms.test.ts`
Expected: PASS

- [ ] **Step 9: Write the failing test for ScheduleTourModal**

Create `src/components/ScheduleTourModal.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ScheduleTourModal } from "./ScheduleTourModal";
import { submitTourRequest } from "../lib/netlify-forms";

vi.mock("../lib/netlify-forms", () => ({
  submitTourRequest: vi.fn(),
}));

async function fillRequiredFields(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText(/name/i), "Rafiq Ahmed");
  await user.type(screen.getByLabelText(/phone/i), "01711000000");
  await user.type(screen.getByLabelText(/email/i), "rafiq@example.com");
  await user.type(screen.getByLabelText(/preferred date/i), "2026-11-05");
}

describe("ScheduleTourModal", () => {
  it("shows a success message after a successful submission", async () => {
    vi.mocked(submitTourRequest).mockResolvedValueOnce(undefined);
    const user = userEvent.setup();
    render(<ScheduleTourModal listingSlug="gulshan-2-modern-apartment" open onOpenChange={() => {}} />);

    await fillRequiredFields(user);
    await user.click(screen.getByRole("button", { name: /request tour/i }));

    expect(await screen.findByRole("status")).toHaveTextContent(/we'll contact you/i);
  });

  it("shows an error message when submission fails", async () => {
    vi.mocked(submitTourRequest).mockRejectedValueOnce(new Error("network error"));
    const user = userEvent.setup();
    render(<ScheduleTourModal listingSlug="gulshan-2-modern-apartment" open onOpenChange={() => {}} />);

    await fillRequiredFields(user);
    await user.click(screen.getByRole("button", { name: /request tour/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent(/something went wrong/i);
  });
});
```

- [ ] **Step 10: Run test to verify it fails**

Run: `npx vitest run src/components/ScheduleTourModal.test.tsx`
Expected: FAIL — `./ScheduleTourModal` does not exist.

- [ ] **Step 11: Implement ScheduleTourModal**

Create `src/components/ScheduleTourModal.tsx`:

```tsx
import { type FormEvent, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { submitTourRequest } from "../lib/netlify-forms";

interface ScheduleTourModalProps {
  listingSlug: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ScheduleTourModal({ listingSlug, open, onOpenChange }: ScheduleTourModalProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    try {
      await submitTourRequest({ listingSlug, name, phone, email, preferredDate, message });
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogTitle>Schedule a Tour</DialogTitle>
        {status === "success" ? (
          <p role="status" className="mt-4 text-stone-700">
            Thanks! We'll contact you to confirm your tour time.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 space-y-3">
            <div>
              <Label htmlFor="tour-name">Name</Label>
              <Input id="tour-name" required value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="tour-phone">Phone</Label>
              <Input id="tour-phone" required value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="tour-email">Email</Label>
              <Input
                id="tour-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="tour-date">Preferred date</Label>
              <Input
                id="tour-date"
                type="date"
                required
                value={preferredDate}
                onChange={(e) => setPreferredDate(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="tour-message">Message (optional)</Label>
              <Textarea id="tour-message" value={message} onChange={(e) => setMessage(e.target.value)} />
            </div>
            {status === "error" && (
              <p role="alert" className="text-sm text-red-600">
                Something went wrong sending your request. Please try again.
              </p>
            )}
            <Button type="submit" disabled={status === "submitting"} className="w-full">
              {status === "submitting" ? "Sending..." : "Request Tour"}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
```

- [ ] **Step 12: Run test to verify it passes**

Run: `npx vitest run src/components/ScheduleTourModal.test.tsx`
Expected: PASS

- [ ] **Step 13: Wire the modal into the detail page, and add the hidden Netlify form**

Modify `index.html`:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Rent Dhaka — Find Your Next Home</title>
  </head>
  <body>
    <div id="root"></div>
    <form name="tour-request" data-netlify="true" hidden>
      <input type="text" name="listingSlug" />
      <input type="text" name="name" />
      <input type="text" name="phone" />
      <input type="email" name="email" />
      <input type="date" name="preferredDate" />
      <textarea name="message"></textarea>
    </form>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

Modify `src/pages/ListingDetailPage.tsx` — add the tour-modal state, the "Schedule Tour" button, and the `Button`/`ScheduleTourModal` imports:

```tsx
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getListingBySlug } from "../lib/listings-repository";
import { formatBDT } from "../lib/format";
import { PhotoGallery } from "../components/PhotoGallery";
import { StickyApplyBar } from "../components/StickyApplyBar";
import { NotFoundMessage } from "../components/NotFoundMessage";
import { ListingsMapView } from "../components/ListingsMapView";
import { ScheduleTourModal } from "../components/ScheduleTourModal";
import { Button } from "../components/ui/button";

export default function ListingDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const listing = slug ? getListingBySlug(slug) : undefined;
  const [tourModalOpen, setTourModalOpen] = useState(false);

  if (!listing) {
    return (
      <NotFoundMessage
        heading="Listing not found"
        message="This listing may have been rented or removed. Browse current listings instead."
      />
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 pb-24 md:pb-8">
      <h1 className="text-2xl font-bold text-stone-900">{listing.title}</h1>
      <p className="mt-1 text-stone-600">{listing.address}</p>

      <div className="mt-6">
        <PhotoGallery photos={listing.photos} alt={listing.title} />
      </div>

      <div className="mt-6 flex flex-wrap gap-6 border-y border-stone-200 py-4 text-stone-700">
        <p className="text-xl font-bold text-accent-700">{formatBDT(listing.rentBDT)}/mo</p>
        <p>{listing.beds} beds</p>
        <p>{listing.baths} baths</p>
        <p>{listing.sqft} sqft</p>
        <p>Deposit: {formatBDT(listing.depositBDT)}</p>
      </div>

      <section className="mt-6">
        <h2 className="text-lg font-semibold text-stone-900">Amenities</h2>
        <ul className="mt-2 grid grid-cols-2 gap-1 text-sm text-stone-700">
          {listing.amenities.map((amenity) => (
            <li key={amenity}>• {amenity}</li>
          ))}
        </ul>
      </section>

      <section className="mt-6 text-sm text-stone-700">
        <h2 className="text-lg font-semibold text-stone-900">Details</h2>
        <p className="mt-2">Pet policy: {listing.petPolicy}</p>
        <p className="mt-1">Parking: {listing.parking}</p>
        <p className="mt-1">Utilities: {listing.utilitiesInfo}</p>
        <p className="mt-1">Lease terms: {listing.leaseTerms}</p>
      </section>

      <section className="mt-6">
        <h2 className="text-lg font-semibold text-stone-900">Location</h2>
        <div className="mt-2">
          <ListingsMapView listings={[listing]} />
        </div>
      </section>

      <div className="mt-8 hidden gap-3 md:flex">
        <Link
          to={`/apply/${listing.slug}`}
          className="rounded-md bg-accent-600 px-6 py-3 text-sm font-medium text-white"
        >
          Apply Now
        </Link>
        <Button variant="outline" size="lg" onClick={() => setTourModalOpen(true)}>
          Schedule Tour
        </Button>
      </div>

      <StickyApplyBar listingSlug={listing.slug} />
      <ScheduleTourModal
        listingSlug={listing.slug}
        open={tourModalOpen}
        onOpenChange={setTourModalOpen}
      />
    </div>
  );
}
```

- [ ] **Step 14: Add a test confirming the Schedule Tour button opens the modal**

Modify `src/pages/ListingDetailPage.test.tsx` — add the netlify-forms mock and a new test:

```tsx
import type { ReactNode } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import ListingDetailPage from "./ListingDetailPage";

vi.mock("react-leaflet", () => ({
  MapContainer: ({ children }: { children: ReactNode }) => (
    <div data-testid="map-container">{children}</div>
  ),
  TileLayer: () => <div data-testid="tile-layer" />,
  Marker: ({ children }: { children?: ReactNode }) => <div data-testid="marker">{children}</div>,
  Popup: ({ children }: { children: ReactNode }) => <div data-testid="popup">{children}</div>,
}));

vi.mock("../lib/netlify-forms", () => ({
  submitTourRequest: vi.fn(),
  submitApplication: vi.fn(),
}));

function renderAt(path: string) {
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/listings/:slug" element={<ListingDetailPage />} />
      </Routes>
    </MemoryRouter>
  );
}

describe("ListingDetailPage", () => {
  it("renders listing details, amenities, map, and the apply link for a valid slug", () => {
    renderAt("/listings/gulshan-2-modern-apartment");

    expect(
      screen.getByRole("heading", { name: /modern 3-bedroom apartment in gulshan 2/i })
    ).toBeInTheDocument();
    expect(screen.getByText("৳55,000/mo")).toBeInTheDocument();
    expect(screen.getByText(/generator backup/i)).toBeInTheDocument();
    expect(screen.getByTestId("map-container")).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: /apply now/i }).length).toBeGreaterThan(0);
  });

  it("shows a not-found message for an unknown slug", () => {
    renderAt("/listings/does-not-exist");

    expect(screen.getByRole("heading", { name: /listing not found/i })).toBeInTheDocument();
  });

  it("opens the schedule tour modal when its button is clicked", async () => {
    const user = userEvent.setup();
    renderAt("/listings/gulshan-2-modern-apartment");

    await user.click(screen.getByRole("button", { name: /schedule tour/i }));
    expect(screen.getByText("Schedule a Tour")).toBeInTheDocument();
  });
});
```

Note: `submitApplication` is included in this mock now because Task 12 adds it to the same `../lib/netlify-forms` module — mocking the whole module here keeps this test file correct after that task lands.

- [ ] **Step 15: Run the full test suite to verify everything passes**

Run: `npx vitest run`
Expected: PASS — all tests from Tasks 1-11 pass.

- [ ] **Step 16: Commit**

```bash
git add -A
git commit -m "feat: add schedule-tour modal submitting to Netlify Forms"
```

---

## Task 12: Rental application multi-step form

**Files:**
- Create: `src/hooks/useApplicationForm.ts`
- Create: `src/components/ui/progress.tsx`
- Create: `src/components/application-steps/PersonalStep.tsx`
- Create: `src/components/application-steps/EmploymentStep.tsx`
- Create: `src/components/application-steps/HistoryStep.tsx`
- Create: `src/components/application-steps/DocumentsStep.tsx`
- Create: `src/components/application-steps/ReviewStep.tsx`
- Modify: `src/lib/netlify-forms.ts`
- Modify: `src/lib/netlify-forms.test.ts`
- Modify: `index.html`
- Modify: `src/pages/ApplicationPage.tsx`
- Test: `src/hooks/useApplicationForm.test.ts`
- Test: `src/components/ui/progress.test.tsx`
- Test: `src/pages/ApplicationPage.test.tsx`

**Interfaces:**
- Consumes: `Input`/`Label`/`Button` from Task 2; `getListingBySlug` from Task 5; `NotFoundMessage` from Task 10; `formatBDT` from Task 5
- Produces: `useApplicationForm()` returning `{ step, data, canGoNext, isFirstStep, isLastStep, updatePersonal, updateEmployment, updateHistory, updateDocuments, goNext, goBack }` with `ApplicationStep` and `ApplicationData` types in `src/hooks/useApplicationForm.ts`; `Progress` primitive; `submitApplication(submission: ApplicationSubmission): Promise<void>` added to `src/lib/netlify-forms.ts`, where `ApplicationSubmission = { listingSlug: string } & ApplicationData`.

- [ ] **Step 1: Write the failing test for useApplicationForm**

Create `src/hooks/useApplicationForm.test.ts`:

```ts
import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useApplicationForm } from "./useApplicationForm";

describe("useApplicationForm", () => {
  it("starts on the personal step and blocks advancing until required fields are valid", () => {
    const { result } = renderHook(() => useApplicationForm());

    expect(result.current.step).toBe("personal");
    expect(result.current.canGoNext).toBe(false);

    act(() => {
      result.current.updatePersonal({
        fullName: "Rafiq Ahmed",
        email: "rafiq@example.com",
        phone: "01711000000",
      });
    });

    expect(result.current.canGoNext).toBe(true);
  });

  it("advances through all steps in order and accumulates data", () => {
    const { result } = renderHook(() => useApplicationForm());

    act(() => {
      result.current.updatePersonal({
        fullName: "Rafiq Ahmed",
        email: "rafiq@example.com",
        phone: "01711000000",
      });
    });
    act(() => result.current.goNext());
    expect(result.current.step).toBe("employment");

    act(() => {
      result.current.updateEmployment({ employer: "ACME Corp", position: "Engineer", monthlyIncomeBDT: 80000 });
    });
    act(() => result.current.goNext());
    expect(result.current.step).toBe("history");

    act(() => {
      result.current.updateHistory({
        previousAddress: "House 1, Road 2, Dhanmondi",
        previousLandlordContact: "",
      });
    });
    act(() => result.current.goNext());
    expect(result.current.step).toBe("documents");

    act(() => {
      result.current.updateDocuments({
        nidFile: new File(["id"], "nid.png", { type: "image/png" }),
        incomeProofFile: null,
      });
    });
    act(() => result.current.goNext());
    expect(result.current.step).toBe("review");
    expect(result.current.isLastStep).toBe(true);
    expect(result.current.data.personal.fullName).toBe("Rafiq Ahmed");
    expect(result.current.data.employment.monthlyIncomeBDT).toBe(80000);
  });

  it("does not advance past the current step when required fields are missing", () => {
    const { result } = renderHook(() => useApplicationForm());

    act(() => result.current.goNext());

    expect(result.current.step).toBe("personal");
  });

  it("goes back a step", () => {
    const { result } = renderHook(() => useApplicationForm());

    act(() => {
      result.current.updatePersonal({
        fullName: "Rafiq Ahmed",
        email: "rafiq@example.com",
        phone: "01711000000",
      });
    });
    act(() => result.current.goNext());
    expect(result.current.step).toBe("employment");

    act(() => result.current.goBack());
    expect(result.current.step).toBe("personal");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/hooks/useApplicationForm.test.ts`
Expected: FAIL — `./useApplicationForm` does not exist.

- [ ] **Step 3: Implement useApplicationForm**

Create `src/hooks/useApplicationForm.ts`:

```ts
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
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/hooks/useApplicationForm.test.ts`
Expected: PASS

- [ ] **Step 5: Write the failing test for Progress**

Create `src/components/ui/progress.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Progress } from "./progress";

describe("Progress", () => {
  it("renders a progressbar reflecting the given value", () => {
    render(<Progress value={40} />);
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "40");
  });
});
```

- [ ] **Step 6: Run test to verify it fails**

Run: `npx vitest run src/components/ui/progress.test.tsx`
Expected: FAIL — `./progress` does not exist.

- [ ] **Step 7: Implement Progress**

Create `src/components/ui/progress.tsx`:

```tsx
import { forwardRef, type ComponentPropsWithoutRef, type ElementRef } from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cn } from "../../lib/cn";

export const Progress = forwardRef<
  ElementRef<typeof ProgressPrimitive.Root>,
  ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    value={value}
    className={cn("h-2 w-full overflow-hidden rounded-full bg-stone-200", className)}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className="h-full bg-accent-600 transition-all"
      style={{ width: `${value ?? 0}%` }}
    />
  </ProgressPrimitive.Root>
));
Progress.displayName = "Progress";
```

- [ ] **Step 8: Run test to verify it passes**

Run: `npx vitest run src/components/ui/progress.test.tsx`
Expected: PASS

- [ ] **Step 9: Implement the five step components (no separate tests — exercised through ApplicationPage in Step 13)**

Create `src/components/application-steps/PersonalStep.tsx`:

```tsx
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
```

Create `src/components/application-steps/EmploymentStep.tsx`:

```tsx
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
```

Create `src/components/application-steps/HistoryStep.tsx`:

```tsx
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import type { ApplicationData } from "../../hooks/useApplicationForm";

interface HistoryStepProps {
  data: ApplicationData["history"];
  onChange: (fields: Partial<ApplicationData["history"]>) => void;
}

export function HistoryStep({ data, onChange }: HistoryStepProps) {
  return (
    <div className="space-y-3">
      <div>
        <Label htmlFor="app-previous-address">Previous address</Label>
        <Input
          id="app-previous-address"
          value={data.previousAddress}
          onChange={(e) => onChange({ previousAddress: e.target.value })}
        />
      </div>
      <div>
        <Label htmlFor="app-landlord-contact">Previous landlord contact (optional)</Label>
        <Input
          id="app-landlord-contact"
          value={data.previousLandlordContact}
          onChange={(e) => onChange({ previousLandlordContact: e.target.value })}
        />
      </div>
    </div>
  );
}
```

Create `src/components/application-steps/DocumentsStep.tsx`:

```tsx
import type { ChangeEvent } from "react";
import { Label } from "../ui/label";
import type { ApplicationData } from "../../hooks/useApplicationForm";

interface DocumentsStepProps {
  data: ApplicationData["documents"];
  onChange: (fields: Partial<ApplicationData["documents"]>) => void;
}

export function DocumentsStep({ data, onChange }: DocumentsStepProps) {
  function handleNidChange(event: ChangeEvent<HTMLInputElement>) {
    onChange({ nidFile: event.target.files?.[0] ?? null });
  }

  function handleIncomeProofChange(event: ChangeEvent<HTMLInputElement>) {
    onChange({ incomeProofFile: event.target.files?.[0] ?? null });
  }

  return (
    <div className="space-y-3">
      <div>
        <Label htmlFor="app-nid-file">National ID (required)</Label>
        <input id="app-nid-file" type="file" onChange={handleNidChange} className="block text-sm" />
        {data.nidFile && <p className="mt-1 text-sm text-stone-600">Selected: {data.nidFile.name}</p>}
      </div>
      <div>
        <Label htmlFor="app-income-proof-file">Income proof (optional)</Label>
        <input
          id="app-income-proof-file"
          type="file"
          onChange={handleIncomeProofChange}
          className="block text-sm"
        />
        {data.incomeProofFile && (
          <p className="mt-1 text-sm text-stone-600">Selected: {data.incomeProofFile.name}</p>
        )}
      </div>
    </div>
  );
}
```

Create `src/components/application-steps/ReviewStep.tsx`:

```tsx
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
```

- [ ] **Step 10: Write the failing test for submitApplication**

Modify `src/lib/netlify-forms.test.ts` — add the import and a new describe block:

```ts
import { beforeEach, describe, expect, it, vi } from "vitest";
import { submitApplication, submitTourRequest, type ApplicationSubmission } from "./netlify-forms";

describe("submitTourRequest", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("POSTs url-encoded form data including the form-name field", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal("fetch", fetchMock);

    await submitTourRequest({
      listingSlug: "gulshan-2-modern-apartment",
      name: "Rafiq Ahmed",
      phone: "01711000000",
      email: "rafiq@example.com",
      preferredDate: "2026-11-05",
      message: "Interested in a weekend tour",
    });

    expect(fetchMock).toHaveBeenCalledWith("/", expect.objectContaining({ method: "POST" }));
    const body = fetchMock.mock.calls[0][1].body as string;
    const params = new URLSearchParams(body);
    expect(params.get("form-name")).toBe("tour-request");
    expect(params.get("listingSlug")).toBe("gulshan-2-modern-apartment");
    expect(params.get("name")).toBe("Rafiq Ahmed");
  });

  it("throws when the response is not ok", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false }));

    await expect(
      submitTourRequest({
        listingSlug: "gulshan-2-modern-apartment",
        name: "Rafiq Ahmed",
        phone: "01711000000",
        email: "rafiq@example.com",
        preferredDate: "2026-11-05",
        message: "",
      })
    ).rejects.toThrow("Tour request submission failed");
  });
});

describe("submitApplication", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  function sampleSubmission(): ApplicationSubmission {
    return {
      listingSlug: "gulshan-2-modern-apartment",
      personal: { fullName: "Rafiq Ahmed", email: "rafiq@example.com", phone: "01711000000" },
      employment: { employer: "ACME Corp", position: "Engineer", monthlyIncomeBDT: 80000 },
      history: { previousAddress: "House 1, Road 2, Dhanmondi", previousLandlordContact: "" },
      documents: {
        nidFile: new File(["id"], "nid.png", { type: "image/png" }),
        incomeProofFile: null,
      },
    };
  }

  it("POSTs multipart form data including the form-name field and the NID file", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal("fetch", fetchMock);

    await submitApplication(sampleSubmission());

    expect(fetchMock).toHaveBeenCalledWith("/", expect.objectContaining({ method: "POST" }));
    const body = fetchMock.mock.calls[0][1].body as FormData;
    expect(body.get("form-name")).toBe("rental-application");
    expect(body.get("fullName")).toBe("Rafiq Ahmed");
    expect(body.get("monthlyIncomeBDT")).toBe("80000");
    expect((body.get("nidFile") as File).name).toBe("nid.png");
  });

  it("throws when the response is not ok", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false }));

    await expect(submitApplication(sampleSubmission())).rejects.toThrow(
      "Application submission failed"
    );
  });
});
```

- [ ] **Step 11: Run test to verify it fails**

Run: `npx vitest run src/lib/netlify-forms.test.ts`
Expected: FAIL — `submitApplication` and `ApplicationSubmission` are not exported yet.

- [ ] **Step 12: Implement submitApplication**

Modify `src/lib/netlify-forms.ts` — add below the existing `submitTourRequest`:

```ts
import type { ApplicationData } from "../hooks/useApplicationForm";

export type ApplicationSubmission = { listingSlug: string } & ApplicationData;

export async function submitApplication(submission: ApplicationSubmission): Promise<void> {
  const formData = new FormData();
  formData.append("form-name", "rental-application");
  formData.append("listingSlug", submission.listingSlug);
  formData.append("fullName", submission.personal.fullName);
  formData.append("email", submission.personal.email);
  formData.append("phone", submission.personal.phone);
  formData.append("employer", submission.employment.employer);
  formData.append("position", submission.employment.position);
  formData.append("monthlyIncomeBDT", String(submission.employment.monthlyIncomeBDT));
  formData.append("previousAddress", submission.history.previousAddress);
  formData.append("previousLandlordContact", submission.history.previousLandlordContact);
  if (submission.documents.nidFile) formData.append("nidFile", submission.documents.nidFile);
  if (submission.documents.incomeProofFile) {
    formData.append("incomeProofFile", submission.documents.incomeProofFile);
  }

  const response = await fetch("/", { method: "POST", body: formData });

  if (!response.ok) {
    throw new Error("Application submission failed");
  }
}
```

(The `import type { ApplicationData } ...` line goes at the top of the file alongside the existing `TourRequestFields` interface; the rest of `netlify-forms.ts` from Task 11 is unchanged.)

- [ ] **Step 13: Run test to verify it passes**

Run: `npx vitest run src/lib/netlify-forms.test.ts`
Expected: PASS

- [ ] **Step 14: Add the hidden rental-application form for Netlify bot detection**

Modify `index.html` — add this form alongside the existing `tour-request` hidden form:

```html
    <form name="rental-application" data-netlify="true" hidden>
      <input type="text" name="listingSlug" />
      <input type="text" name="fullName" />
      <input type="email" name="email" />
      <input type="text" name="phone" />
      <input type="text" name="employer" />
      <input type="text" name="position" />
      <input type="number" name="monthlyIncomeBDT" />
      <input type="text" name="previousAddress" />
      <input type="text" name="previousLandlordContact" />
      <input type="file" name="nidFile" />
      <input type="file" name="incomeProofFile" />
    </form>
```

- [ ] **Step 15: Write the failing test for ApplicationPage**

Create `src/pages/ApplicationPage.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import ApplicationPage from "./ApplicationPage";
import { submitApplication } from "../lib/netlify-forms";

vi.mock("../lib/netlify-forms", () => ({
  submitApplication: vi.fn(),
  submitTourRequest: vi.fn(),
}));

function renderAt(path: string) {
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/apply/:slug" element={<ApplicationPage />} />
      </Routes>
    </MemoryRouter>
  );
}

async function completeAllSteps(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText(/full name/i), "Rafiq Ahmed");
  await user.type(screen.getByLabelText(/^email$/i), "rafiq@example.com");
  await user.type(screen.getByLabelText(/^phone$/i), "01711000000");
  await user.click(screen.getByRole("button", { name: /next/i }));

  await user.type(screen.getByLabelText(/employer/i), "ACME Corp");
  await user.type(screen.getByLabelText(/position/i), "Engineer");
  await user.type(screen.getByLabelText(/monthly income/i), "80000");
  await user.click(screen.getByRole("button", { name: /next/i }));

  await user.type(screen.getByLabelText(/previous address/i), "House 1, Road 2, Dhanmondi");
  await user.click(screen.getByRole("button", { name: /next/i }));

  await user.upload(
    screen.getByLabelText(/national id/i),
    new File(["id"], "nid.png", { type: "image/png" })
  );
  await user.click(screen.getByRole("button", { name: /next/i }));
}

describe("ApplicationPage", () => {
  it("shows a not-found message for an unknown slug", () => {
    renderAt("/apply/does-not-exist");
    expect(screen.getByRole("heading", { name: /listing not found/i })).toBeInTheDocument();
  });

  it("blocks moving to the next step until the current step's required fields are valid", async () => {
    const user = userEvent.setup();
    renderAt("/apply/gulshan-2-modern-apartment");

    expect(screen.getByRole("button", { name: /next/i })).toBeDisabled();
    await user.type(screen.getByLabelText(/full name/i), "Rafiq Ahmed");
    await user.type(screen.getByLabelText(/^email$/i), "rafiq@example.com");
    await user.type(screen.getByLabelText(/^phone$/i), "01711000000");
    expect(screen.getByRole("button", { name: /next/i })).toBeEnabled();
  });

  it("walks through every step and submits successfully on review", async () => {
    vi.mocked(submitApplication).mockResolvedValueOnce(undefined);
    const user = userEvent.setup();
    renderAt("/apply/gulshan-2-modern-apartment");

    await completeAllSteps(user);

    expect(screen.getByText(/nid\.png/i)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /submit application/i }));

    expect(await screen.findByRole("status")).toHaveTextContent(/application submitted/i);
  });

  it("shows an error message when submission fails", async () => {
    vi.mocked(submitApplication).mockRejectedValueOnce(new Error("network error"));
    const user = userEvent.setup();
    renderAt("/apply/gulshan-2-modern-apartment");

    await completeAllSteps(user);
    await user.click(screen.getByRole("button", { name: /submit application/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent(/something went wrong/i);
  });
});
```

- [ ] **Step 16: Run test to verify it fails**

Run: `npx vitest run src/pages/ApplicationPage.test.tsx`
Expected: FAIL — `ApplicationPage` still renders only the Task 3 stub heading.

- [ ] **Step 17: Implement the real ApplicationPage**

Modify `src/pages/ApplicationPage.tsx`:

```tsx
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

  async function handleFinalSubmit() {
    setSubmitStatus("submitting");
    try {
      await submitApplication({ listingSlug: listing.slug, ...form.data });
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
```

- [ ] **Step 18: Update the Task 3 route test for the new application heading**

Modify `src/AppRoutes.test.tsx` — the stub-era test used a nonexistent slug and matched the stub heading; replace it with a real slug and the real heading it now renders:

```tsx
  it("renders the application page at /apply/:slug", () => {
    renderAt("/apply/gulshan-2-modern-apartment");
    expect(
      screen.getByRole("heading", { name: /apply for modern 3-bedroom apartment in gulshan 2/i })
    ).toBeInTheDocument();
  });
```

- [ ] **Step 19: Run the full test suite to verify everything passes**

Run: `npx vitest run`
Expected: PASS — all tests from Tasks 1-12 pass.

- [ ] **Step 20: Commit**

```bash
git add -A
git commit -m "feat: build multi-step rental application form with Netlify Forms submission"
```

---

## Task 13: Property-type SEO pages

**Files:**
- Modify: `src/pages/PropertyTypePage.tsx`
- Modify: `src/AppRoutes.test.tsx`
- Test: `src/pages/PropertyTypePage.test.tsx`

**Interfaces:**
- Consumes: `getPropertyTypeInfo` from Task 6; `getListings` from Task 5; `ListingCard` from Task 7; `NotFoundMessage` from Task 10
- Produces: real `PropertyTypePage` content at `/property-types/:type`

- [ ] **Step 1: Write the failing test**

Create `src/pages/PropertyTypePage.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it } from "vitest";
import PropertyTypePage from "./PropertyTypePage";

function renderAt(path: string) {
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/property-types/:type" element={<PropertyTypePage />} />
      </Routes>
    </MemoryRouter>
  );
}

describe("PropertyTypePage", () => {
  it("renders the condo type info and only condo listings", () => {
    renderAt("/property-types/condo");

    expect(screen.getByRole("heading", { name: /condos for rent in dhaka/i })).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: /view details/i })).toHaveLength(2);
  });

  it("shows a not-found message for an unknown type", () => {
    renderAt("/property-types/mansion");

    expect(screen.getByRole("heading", { name: /property type not found/i })).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/pages/PropertyTypePage.test.tsx`
Expected: FAIL — `PropertyTypePage` still renders only the Task 3 stub heading.

- [ ] **Step 3: Implement the real PropertyTypePage**

Modify `src/pages/PropertyTypePage.tsx`:

```tsx
import { useParams } from "react-router-dom";
import { getPropertyTypeInfo } from "../lib/content-repository";
import { getListings } from "../lib/listings-repository";
import { ListingCard } from "../components/ListingCard";
import { NotFoundMessage } from "../components/NotFoundMessage";
import type { PropertyType } from "../types";

export default function PropertyTypePage() {
  const { type } = useParams<{ type: string }>();
  const info = type ? getPropertyTypeInfo(type) : undefined;

  if (!info) {
    return (
      <NotFoundMessage
        heading="Property type not found"
        message="We don't have a page for that property type. Browse all listings instead."
      />
    );
  }

  const listings = getListings({ propertyType: info.type as PropertyType });

  return (
    <div>
      <section className="bg-accent-50 px-4 py-12 text-center">
        <h1 className="text-3xl font-bold text-stone-900">{info.title}</h1>
        <p className="mx-auto mt-3 max-w-2xl text-stone-600">{info.description}</p>
      </section>
      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="text-xl font-semibold text-stone-900">Available {info.title}</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {listings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      </section>
    </div>
  );
}
```

- [ ] **Step 4: Update the Task 3 route test for the new property-type heading**

Modify `src/AppRoutes.test.tsx` — replace the property-type test's assertion:

```tsx
  it("renders the property type page at /property-types/:type", () => {
    renderAt("/property-types/apartment");
    expect(
      screen.getByRole("heading", { name: /apartments for rent in dhaka/i })
    ).toBeInTheDocument();
  });
```

- [ ] **Step 5: Run the full test suite to verify everything passes**

Run: `npx vitest run`
Expected: PASS — all tests from Tasks 1-13 pass.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: build property-type SEO landing pages"
```

---

## Task 14: About page

**Files:**
- Create: `src/components/TeamGrid.tsx`
- Create: `src/components/TestimonialsList.tsx`
- Modify: `src/pages/AboutPage.tsx`
- Test: `src/components/TeamGrid.test.tsx`
- Test: `src/components/TestimonialsList.test.tsx`
- Test: `src/pages/AboutPage.test.tsx`

**Interfaces:**
- Consumes: `getTeamMembers`, `getTestimonials` from Task 6
- Produces: `TeamGrid`, `TestimonialsList` components; real `AboutPage` content

- [ ] **Step 1: Write the failing test for TeamGrid**

Create `src/components/TeamGrid.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TeamGrid } from "./TeamGrid";

describe("TeamGrid", () => {
  it("renders every team member's name and role", () => {
    render(<TeamGrid />);
    expect(screen.getByText("Shahriar Kabir")).toBeInTheDocument();
    expect(screen.getByText("Founder & Managing Director")).toBeInTheDocument();
    expect(screen.getByText("Farhana Akter")).toBeInTheDocument();
    expect(screen.getByText("Tanvir Islam")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/TeamGrid.test.tsx`
Expected: FAIL — `./TeamGrid` does not exist.

- [ ] **Step 3: Implement TeamGrid**

Create `src/components/TeamGrid.tsx`:

```tsx
import { getTeamMembers } from "../lib/content-repository";

export function TeamGrid() {
  const team = getTeamMembers();

  return (
    <div className="grid gap-6 sm:grid-cols-3">
      {team.map((member) => (
        <div key={member.id} className="text-center">
          <img
            src={member.photo}
            alt={member.name}
            className="mx-auto h-24 w-24 rounded-full object-cover"
          />
          <p className="mt-3 font-semibold text-stone-900">{member.name}</p>
          <p className="text-sm text-stone-600">{member.role}</p>
          <p className="mt-2 text-sm text-stone-600">{member.bio}</p>
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/components/TeamGrid.test.tsx`
Expected: PASS

- [ ] **Step 5: Write the failing test for TestimonialsList**

Create `src/components/TestimonialsList.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TestimonialsList } from "./TestimonialsList";

describe("TestimonialsList", () => {
  it("renders every testimonial's quote and author", () => {
    render(<TestimonialsList />);
    expect(screen.getByText(/found our gulshan apartment/i)).toBeInTheDocument();
    expect(screen.getByText("Rafiq Ahmed")).toBeInTheDocument();
  });
});
```

- [ ] **Step 6: Run test to verify it fails**

Run: `npx vitest run src/components/TestimonialsList.test.tsx`
Expected: FAIL — `./TestimonialsList` does not exist.

- [ ] **Step 7: Implement TestimonialsList**

Create `src/components/TestimonialsList.tsx`:

```tsx
import { getTestimonials } from "../lib/content-repository";

export function TestimonialsList() {
  const testimonials = getTestimonials();

  return (
    <div className="grid gap-6 sm:grid-cols-3">
      {testimonials.map((testimonial) => (
        <blockquote key={testimonial.id} className="rounded-lg border border-stone-200 p-4">
          <p className="text-stone-700">"{testimonial.quote}"</p>
          <footer className="mt-2 text-sm font-medium text-stone-900">{testimonial.name}</footer>
        </blockquote>
      ))}
    </div>
  );
}
```

- [ ] **Step 8: Run test to verify it passes**

Run: `npx vitest run src/components/TestimonialsList.test.tsx`
Expected: PASS

- [ ] **Step 9: Write the failing test for AboutPage**

Create `src/pages/AboutPage.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import AboutPage from "./AboutPage";

describe("AboutPage", () => {
  it("renders the about heading, team, and testimonials", () => {
    render(<AboutPage />);
    expect(screen.getByRole("heading", { name: /about rent dhaka/i })).toBeInTheDocument();
    expect(screen.getByText("Shahriar Kabir")).toBeInTheDocument();
    expect(screen.getByText(/found our gulshan apartment/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 10: Run test to verify it fails**

Run: `npx vitest run src/pages/AboutPage.test.tsx`
Expected: FAIL — `AboutPage` still renders only the Task 3 stub heading.

- [ ] **Step 11: Implement the real AboutPage**

Modify `src/pages/AboutPage.tsx`:

```tsx
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
```

- [ ] **Step 12: Run the full test suite to verify everything passes**

Run: `npx vitest run`
Expected: PASS — all tests from Tasks 1-14 pass. The Task 3 `AppRoutes` test for `/about` still matches, since "About Rent Dhaka" contains "about".

- [ ] **Step 13: Commit**

```bash
git add -A
git commit -m "feat: build about page with team grid and testimonials"
```

---

## Task 15: Contact page

**Files:**
- Create: `src/components/OfficeMap.tsx`
- Modify: `src/pages/ContactPage.tsx`
- Test: `src/components/OfficeMap.test.tsx`
- Test: `src/pages/ContactPage.test.tsx`

**Interfaces:**
- Consumes: nothing new (static office location)
- Produces: `OfficeMap` component; real `ContactPage` content with `tel:`, `https://wa.me/`, and `mailto:` links

- [ ] **Step 1: Write the failing test for OfficeMap**

Create `src/components/OfficeMap.test.tsx`:

```tsx
import type { ReactNode } from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { OfficeMap } from "./OfficeMap";

vi.mock("react-leaflet", () => ({
  MapContainer: ({ children }: { children: ReactNode }) => (
    <div data-testid="map-container">{children}</div>
  ),
  TileLayer: () => <div data-testid="tile-layer" />,
  Marker: ({ children }: { children?: ReactNode }) => <div data-testid="marker">{children}</div>,
  Popup: ({ children }: { children: ReactNode }) => <div data-testid="popup">{children}</div>,
}));

describe("OfficeMap", () => {
  it("renders a single marker with the office address in its popup", () => {
    render(<OfficeMap />);
    expect(screen.getByTestId("map-container")).toBeInTheDocument();
    expect(screen.getAllByTestId("marker")).toHaveLength(1);
    expect(screen.getByText(/gulshan 2/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/OfficeMap.test.tsx`
Expected: FAIL — `./OfficeMap` does not exist.

- [ ] **Step 3: Implement OfficeMap**

Create `src/components/OfficeMap.tsx`:

```tsx
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

const OFFICE_POSITION: [number, number] = [23.7925, 90.4078];

export function OfficeMap() {
  return (
    <MapContainer center={OFFICE_POSITION} zoom={15} style={{ height: "300px", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={OFFICE_POSITION}>
        <Popup>Rent Dhaka Office — House 14, Road 103, Gulshan 2</Popup>
      </Marker>
    </MapContainer>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/components/OfficeMap.test.tsx`
Expected: PASS

- [ ] **Step 5: Write the failing test for ContactPage**

Create `src/pages/ContactPage.test.tsx`:

```tsx
import type { ReactNode } from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ContactPage from "./ContactPage";

vi.mock("react-leaflet", () => ({
  MapContainer: ({ children }: { children: ReactNode }) => (
    <div data-testid="map-container">{children}</div>
  ),
  TileLayer: () => <div data-testid="tile-layer" />,
  Marker: ({ children }: { children?: ReactNode }) => <div data-testid="marker">{children}</div>,
  Popup: ({ children }: { children: ReactNode }) => <div data-testid="popup">{children}</div>,
}));

describe("ContactPage", () => {
  it("renders click-to-call, WhatsApp, and email links plus the office map", () => {
    render(<ContactPage />);

    expect(screen.getByRole("link", { name: /call/i })).toHaveAttribute(
      "href",
      "tel:+8801711000000"
    );
    expect(screen.getByRole("link", { name: /whatsapp/i })).toHaveAttribute(
      "href",
      "https://wa.me/8801711000000"
    );
    expect(screen.getByRole("link", { name: /hello@rentdhaka\.com/i })).toHaveAttribute(
      "href",
      "mailto:hello@rentdhaka.com"
    );
    expect(screen.getByTestId("map-container")).toBeInTheDocument();
  });
});
```

- [ ] **Step 6: Run test to verify it fails**

Run: `npx vitest run src/pages/ContactPage.test.tsx`
Expected: FAIL — `ContactPage` still renders only the Task 3 stub heading.

- [ ] **Step 7: Implement the real ContactPage**

Modify `src/pages/ContactPage.tsx`:

```tsx
import { Mail, MessageCircle, Phone } from "lucide-react";
import { OfficeMap } from "../components/OfficeMap";

const PHONE_NUMBER = "+8801711000000";
const WHATSAPP_NUMBER = "8801711000000";
const EMAIL = "hello@rentdhaka.com";

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-3xl font-bold text-stone-900">Contact Us</h1>
      <p className="mt-3 text-stone-600">
        Reach our Gulshan office directly, or message us on WhatsApp for the fastest response.
      </p>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <a
          href={`tel:${PHONE_NUMBER}`}
          className="flex items-center gap-2 rounded-md bg-accent-600 px-4 py-2 text-sm font-medium text-white"
        >
          <Phone className="h-4 w-4" /> Call {PHONE_NUMBER}
        </a>
        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}`}
          className="flex items-center gap-2 rounded-md bg-stone-100 px-4 py-2 text-sm font-medium text-stone-900"
        >
          <MessageCircle className="h-4 w-4" /> WhatsApp Us
        </a>
        <a
          href={`mailto:${EMAIL}`}
          className="flex items-center gap-2 rounded-md border border-stone-300 px-4 py-2 text-sm font-medium text-stone-900"
        >
          <Mail className="h-4 w-4" /> {EMAIL}
        </a>
      </div>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-stone-900">Our Office</h2>
        <p className="mt-2 text-stone-600">House 14, Road 103, Gulshan 2, Dhaka 1212</p>
        <div className="mt-4">
          <OfficeMap />
        </div>
      </section>
    </div>
  );
}
```

- [ ] **Step 8: Run the full test suite to verify everything passes**

Run: `npx vitest run`
Expected: PASS — all tests from Tasks 1-15 pass.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat: build contact page with click-to-call, WhatsApp, and office map"
```

---

## Task 16: Privacy policy page

**Files:**
- Modify: `src/pages/PrivacyPolicyPage.tsx`
- Test: `src/pages/PrivacyPolicyPage.test.tsx`

**Interfaces:**
- Consumes: nothing new
- Produces: real `PrivacyPolicyPage` content explaining the Netlify Forms data flow (spec §8)

- [ ] **Step 1: Write the failing test**

Create `src/pages/PrivacyPolicyPage.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import PrivacyPolicyPage from "./PrivacyPolicyPage";

describe("PrivacyPolicyPage", () => {
  it("renders the privacy heading and explains Netlify Forms handles submissions", () => {
    render(<PrivacyPolicyPage />);
    expect(screen.getByRole("heading", { name: /privacy policy/i })).toBeInTheDocument();
    expect(screen.getByText(/netlify forms/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/pages/PrivacyPolicyPage.test.tsx`
Expected: FAIL — `PrivacyPolicyPage` still renders only the Task 3 stub heading.

- [ ] **Step 3: Implement the real PrivacyPolicyPage**

Modify `src/pages/PrivacyPolicyPage.tsx`:

```tsx
export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 text-stone-700">
      <h1 className="text-3xl font-bold text-stone-900">Privacy Policy</h1>
      <p className="mt-4">
        Rent Dhaka collects only the information you choose to submit through our Schedule a Tour
        and Rental Application forms: your name, contact details, employment information, and any
        documents you upload. These submissions are processed by Netlify Forms, our form-handling
        provider, and are never stored in this website's own codebase or public database.
      </p>
      <p className="mt-4">
        We use this information solely to respond to tour requests and evaluate rental
        applications. We do not sell or share your information with third parties beyond what is
        necessary to process your request.
      </p>
      <p className="mt-4">
        If you would like your submitted information removed, contact us at{" "}
        <a href="mailto:hello@rentdhaka.com" className="text-accent-600 underline">
          hello@rentdhaka.com
        </a>
        .
      </p>
    </div>
  );
}
```

- [ ] **Step 4: Run the full test suite to verify everything passes**

Run: `npx vitest run`
Expected: PASS — all tests from Tasks 1-16 pass.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: build privacy policy page"
```

---

## Task 17: Accessibility automated audit

**Files:**
- Modify: `src/test/setup.ts`
- Modify: `src/index.css`
- Test: `src/test/a11y.test.tsx`

**Interfaces:**
- Consumes: `HomePage`, `ListingsPage`, `ListingDetailPage`, `AboutPage`, `ContactPage` from Tasks 7, 8, 11, 14, 15
- Produces: `toHaveNoViolations` matcher registered globally for all tests; `prefers-reduced-motion` CSS rule (spec §8)

- [ ] **Step 1: Register the jest-axe matcher globally**

Modify `src/test/setup.ts`:

```ts
import "@testing-library/jest-dom/vitest";
import { toHaveNoViolations } from "jest-axe";

expect.extend(toHaveNoViolations);
```

- [ ] **Step 2: Write the failing test**

Create `src/test/a11y.test.tsx`:

```tsx
import type { ReactNode } from "react";
import { render } from "@testing-library/react";
import { axe } from "jest-axe";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import HomePage from "../pages/HomePage";
import ListingsPage from "../pages/ListingsPage";
import ListingDetailPage from "../pages/ListingDetailPage";
import AboutPage from "../pages/AboutPage";
import ContactPage from "../pages/ContactPage";

vi.mock("react-leaflet", () => ({
  MapContainer: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  TileLayer: () => <div />,
  Marker: ({ children }: { children?: ReactNode }) => <div>{children}</div>,
  Popup: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));

vi.mock("../lib/netlify-forms", () => ({
  submitTourRequest: vi.fn(),
  submitApplication: vi.fn(),
}));

describe("accessibility", () => {
  it("Home page has no axe violations", async () => {
    const { container } = render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("Listings page has no axe violations", async () => {
    const { container } = render(
      <MemoryRouter initialEntries={["/listings"]}>
        <ListingsPage />
      </MemoryRouter>
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("Listing detail page has no axe violations", async () => {
    const { container } = render(
      <MemoryRouter initialEntries={["/listings/gulshan-2-modern-apartment"]}>
        <Routes>
          <Route path="/listings/:slug" element={<ListingDetailPage />} />
        </Routes>
      </MemoryRouter>
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("About page has no axe violations", async () => {
    const { container } = render(<AboutPage />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("Contact page has no axe violations", async () => {
    const { container } = render(<ContactPage />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
```

- [ ] **Step 3: Run test to verify it fails**

Run: `npx vitest run src/test/a11y.test.tsx`
Expected: FAIL — `jest-axe` matcher not yet registered (before Step 1 is wired) or page markup issues. Run it after Step 1 is in place; if any page fails with concrete axe violations, fix the markup named in the failure (most commonly a missing form label or heading order) before proceeding.

- [ ] **Step 4: Add the prefers-reduced-motion rule**

Modify `src/index.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npx vitest run src/test/a11y.test.tsx`
Expected: PASS — zero axe violations on all five pages.

- [ ] **Step 6: Run the full test suite to verify everything passes**

Run: `npx vitest run`
Expected: PASS — all tests from Tasks 1-17 pass.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "test: add automated accessibility audit and prefers-reduced-motion support"
```

---

## Task 18: Netlify build configuration and final verification

**Files:**
- Create: `netlify.toml`

**Interfaces:**
- Consumes: the whole app built in Tasks 1-17
- Produces: a deployable Netlify configuration with SPA routing support; this task's deliverable is a verified green build+test suite, not new application code.

- [ ] **Step 1: Create the Netlify build configuration**

Create `netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

The redirect rule is required because this is a client-side-routed SPA: without it, a direct browser request to e.g. `/listings/gulshan-2-modern-apartment` or a page refresh on any non-root route would 404 on Netlify's static file server instead of loading `index.html` and letting React Router take over.

- [ ] **Step 2: Run the full automated test suite**

Run: `npx vitest run`
Expected: PASS — every test from Tasks 1-17 passes (listings repository filters, URL filter parsing, BDT formatting, all page/component tests, the Netlify Forms submission tests, and the axe accessibility audit).

- [ ] **Step 3: Run a production build**

Run: `npm run build`
Expected: TypeScript compiles with zero errors and Vite produces a `dist/` bundle with no build warnings about unresolved imports.

- [ ] **Step 4: Manually verify the two Netlify Forms are detectable**

Run: `npm run preview`, open the printed local URL, and view page source (not the rendered DOM) to confirm the `tour-request` and `rental-application` hidden `<form>` elements from Tasks 11 and 12 are present in the static HTML served from `index.html`. This is what Netlify's build-time bot scans to register the forms — if Netlify Forms submissions silently fail after deploy, this is the first thing to check.

- [ ] **Step 5: Manually verify responsive layout and Lighthouse scores**

With `npm run preview` still running, check the following in a browser (no automated test covers this — it is a manual design-quality pass, not a correctness check):
- Resize to a mobile width (375px) and confirm: the sticky Apply bar appears on a listing detail page, the filter sidebar on `/listings` stacks above the results, and no horizontal scrollbar appears on any page.
- Run Chrome DevTools Lighthouse (or `npx lighthouse <preview-url> --view`) against the home page and a listing detail page; confirm Accessibility and Best Practices scores are both 90+. Investigate and fix any flagged issue before considering the project done.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "chore: add Netlify build config with SPA redirect"
```
