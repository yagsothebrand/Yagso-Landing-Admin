import "./App.css";
import "./index.css";
import { Suspense } from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Root from "./roots/roots";
import { LoadingHelper } from "./lib/LoadingHelper";
import { ProtectedRoute } from "./components/auth/protected-route";

// Public pages
import Index from "./pages/admin/Index";
import NotFound from "./pages/NotFound";

// Protected pages
import AdminDashboard from "./components/layout/AdminDashboard";
import InvoicesPage from "./pages/InvoicesPage";
import { CategoryPage } from "./pages/CategoryPage";
import { AdministrationPage } from "./pages/AdministrationPage";
import { AnalyticsDashboard } from "./pages/AnalyticsDashboard";
import { EmailLogsPage } from "./pages/EmailLogsPage";
import ComingSoon from "./pages/ComingSoon";
import WaitlistForm from "./pages/landing/WaitListForm";
import Page from "./pages/landing/Index";
import { LandingAuthProvider } from "./components/landingauth/LandingAuthProvider";
import { ProductsPage } from "./pages/ProductsPage";
import { WaitListEmails } from "./pages/WaitListEmails";
import ProductDetails from "./pages/landing/ProductDetails";
import Layout from "./components/layouts/Layout";
import Home from "./pages/landing/Home";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <LandingAuthProvider>
          <Root />
        </LandingAuthProvider>
      ),
      children: [
        // ------------------------
        // ✅ Public routes
        // ------------------------
        {
          index: true,
          element: (
            <Suspense fallback={<LoadingHelper />}>
              <Page />
            </Suspense>
          ),
        },
        {
          path: "/home",

          element: (
            <Suspense fallback={<LoadingHelper />}>
              <Home />
            </Suspense>
          ),
        },
        {
          path: "/product/:slug",
          element: (
            <Suspense fallback={<LoadingHelper />}>
              <Layout>
                <ProductDetails />
              </Layout>
            </Suspense>
          ),
        },

        {
          path: "/:id",
          element: (
            <Suspense fallback={<LoadingHelper />}>
              <Page />
            </Suspense>
          ),
        },
        {
          path: "/admin",
          element: (
            <Suspense fallback={<LoadingHelper />}>
              <Index />
            </Suspense>
          ),
        },
        {
          path: "/waitlist",
          element: (
            <Suspense fallback={<LoadingHelper />}>
              <WaitlistForm />
            </Suspense>
          ),
        },

        // ------------------------
        // 🔐 Protected routes
        // ------------------------
        {
          path: "/dashboard",
          element: (
            <Suspense fallback={<LoadingHelper />}>
              <ProtectedRoute requiredRole="Sales Representative">
                <AdminDashboard />
              </ProtectedRoute>
            </Suspense>
          ),
        },
        {
          path: "/dashboard/invoices",
          element: (
            <Suspense fallback={<LoadingHelper />}>
              <ProtectedRoute requiredRole="Sales Representative">
                <InvoicesPage />
              </ProtectedRoute>
            </Suspense>
          ),
        },
        {
          path: "/dashboard/products",
          element: (
            <Suspense fallback={<LoadingHelper />}>
              <ProtectedRoute requiredRole="Sales Representative">
                <ProductsPage />
              </ProtectedRoute>
            </Suspense>
          ),
        },

        {
          path: "/dashboard/categories",
          element: (
            <Suspense fallback={<LoadingHelper />}>
              <ProtectedRoute requiredRole="Sales Representative">
                <CategoryPage />
              </ProtectedRoute>
            </Suspense>
          ),
        },
        {
          path: "/dashboard/administration",
          element: (
            <Suspense fallback={<LoadingHelper />}>
              <ProtectedRoute requiredRole="General Manager">
                <AdministrationPage />
              </ProtectedRoute>
            </Suspense>
          ),
        },
        {
          path: "/dashboard/analytics",
          element: (
            <Suspense fallback={<LoadingHelper />}>
              <ProtectedRoute requiredRole="General Manager">
                <AnalyticsDashboard />
              </ProtectedRoute>
            </Suspense>
          ),
        },
        {
          path: "/dashboard/email",
          element: (
            <Suspense fallback={<LoadingHelper />}>
              <ProtectedRoute requiredRole="General Manager">
                <EmailLogsPage />
              </ProtectedRoute>
            </Suspense>
          ),
        },
        {
          path: "/dashboard/waitlist",
          element: (
            <Suspense fallback={<LoadingHelper />}>
              <ProtectedRoute requiredRole="General Manager">
                <WaitListEmails />
              </ProtectedRoute>
            </Suspense>
          ),
        },

        // ------------------------
        // 🚧 Coming Soon / Fallback
        // ------------------------
        {
          path: "/coming-soon",
          element: (
            <Suspense fallback={<LoadingHelper />}>
              <ComingSoon />
            </Suspense>
          ),
        },
        {
          path: "*",
          element: (
            <Suspense fallback={<LoadingHelper />}>
              <NotFound />
            </Suspense>
          ),
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
