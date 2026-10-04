import { Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { ComingSoonPage } from "./components/ComingSoonPage";
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
        <Route
          path="barakah-property-solutions"
          element={
            <ComingSoonPage
              title="Barakah Property Solutions"
              message="A dedicated property solutions service is launching soon."
            />
          }
        />
        <Route
          path="barakahaid"
          element={
            <ComingSoonPage
              title="BarakahAid"
              message="BarakahAid is launching soon."
            />
          }
        />
        <Route
          path="login"
          element={
            <ComingSoonPage
              title="Login / Sign Up"
              message="Account login and sign-up are launching soon with our new admin and user portal."
            />
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
