// src/App.jsx
import "./App.css";
import "./index.css";
import { Suspense, lazy } from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Root from "./roots/roots";
import { LoadingHelper } from "./lib/LoadingHelper";
import { ProtectedRoute } from "./components/auth/protected-route";
import { LandingAuthProvider } from "./components/landingauth/LandingAuthProvider";
import { ErrorBoundary } from "react-error-boundary";
import WaitlistHome from "./pages/landing/WaitlistHome";
import TokenPage from "./pages/landing/TokenPage";
import { ErrorPage } from "./pages/ErrorPage";
import CheckoutPage from "./pages/CheckoutPage";
import Account from "./pages/AccountPage";
import TermsOfService from "./pages/TermsOfService";
import ReturnAndRefundPolicy from "./pages/RefundPolicy";

// -------- Lazy-loaded components --------
const Index = lazy(() => import("./pages/admin/Index"));
const NotFound = lazy(() => import("./pages/NotFound"));
const AdminDashboard = lazy(() => import("./components/layout/AdminDashboard"));
const InvoicesPage = lazy(() => import("./pages/InvoicesPage"));
const CategoryPage = lazy(() => import("./pages/CategoryPage"));
const AdministrationPage = lazy(() => import("./pages/AdministrationPage"));
const AnalyticsDashboard = lazy(() => import("./pages/AnalyticsDashboard"));
const EmailLogsPage = lazy(() => import("./pages/EmailLogsPage"));
const ComingSoon = lazy(() => import("./pages/ComingSoon"));
const WaitlistForm = lazy(() => import("./pages/landing/WaitListForm"));
const Page = lazy(() => import("./pages/landing/Index"));
const ProductsPage = lazy(() => import("./pages/ProductsPage"));
const WaitListEmails = lazy(() => import("./pages/WaitListEmails"));
const ProductDetails = lazy(() => import("./pages/landing/ProductDetails"));
const Layout = lazy(() => import("./components/layouts/Layout"));
const Home = lazy(() => import("./pages/landing/Home"));

// -------- Helper wrapper for lazy + error boundary --------
const SafeSuspense = ({ children }) => (
  <Suspense fallback={<LoadingHelper />}>
    <ErrorBoundary FallbackComponent={ErrorPage}>{children}</ErrorBoundary>
  </Suspense>
);

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Root />,
      children: [
        // ------------------------
        // Public routes
        // ------------------------
        {
          index: true,
          element: (
            <SafeSuspense>
              <Page />
            </SafeSuspense>
          ),
        },
        {
          path: "/home",
          element: (
            <SafeSuspense>
              <Home />
            </SafeSuspense>
          ),
        },
        {
          path: "/product/:id",
          element: (
            <SafeSuspense>
              <Layout>
                <ProductDetails />
              </Layout>
            </SafeSuspense>
          ),
        },
        {
          path: "/checkout/:checkoutId",
          element: (
            <SafeSuspense>
              <Layout>
                <CheckoutPage />
              </Layout>
            </SafeSuspense>
          ),
        },
        // {
        //   path: "/:id",
        //   element: (
        //     <SafeSuspense>
        //       <TokenPage />
        //     </SafeSuspense>
        //   ),
        // },
        {
          path: "/admin",
          element: (
            <SafeSuspense>
              <Index />
            </SafeSuspense>
          ),
        },
        {
          path: "/waitlist",
          element: (
            <SafeSuspense>
              <WaitlistHome />
            </SafeSuspense>
          ),
        },
        {
          path: "/terms",
          element: (
            <SafeSuspense>
              <Layout>
                <TermsOfService />
              </Layout>
            </SafeSuspense>
          ),
        },
        {
          path: "/return-refund",
          element: (
            <SafeSuspense>
              {" "}
              <Layout>
                <ReturnAndRefundPolicy />
              </Layout>
            </SafeSuspense>
          ),
        },

        {
          path: "/:token",
          element: (
            <SafeSuspense>
              <TokenPage />
            </SafeSuspense>
          ),
        },
        {
          path: "/account",
          element: (
            <SafeSuspense>
              <Layout>
                <Account />
              </Layout>
            </SafeSuspense>
          ),
        },
        // ------------------------
        // Protected routes
        // ------------------------
        {
          path: "/dashboard",
          element: (
            <ProtectedRoute requiredRole="Sales Representative">
              <SafeSuspense>
                <AdminDashboard />
              </SafeSuspense>
            </ProtectedRoute>
          ),
        },
        {
          path: "/dashboard/invoices",
          element: (
            <ProtectedRoute requiredRole="Sales Representative">
              <SafeSuspense>
                <InvoicesPage />
              </SafeSuspense>
            </ProtectedRoute>
          ),
        },
        {
          path: "/dashboard/products",
          element: (
            <ProtectedRoute requiredRole="Sales Representative">
              <SafeSuspense>
                <ProductsPage />
              </SafeSuspense>
            </ProtectedRoute>
          ),
        },
        {
          path: "/dashboard/categories",
          element: (
            <ProtectedRoute requiredRole="Sales Representative">
              <SafeSuspense>
                <CategoryPage />
              </SafeSuspense>
            </ProtectedRoute>
          ),
        },
        {
          path: "/dashboard/administration",
          element: (
            <ProtectedRoute requiredRole="General Manager">
              <SafeSuspense>
                <AdministrationPage />
              </SafeSuspense>
            </ProtectedRoute>
          ),
        },
        {
          path: "/dashboard/analytics",
          element: (
            <ProtectedRoute requiredRole="General Manager">
              <SafeSuspense>
                <AnalyticsDashboard />
              </SafeSuspense>
            </ProtectedRoute>
          ),
        },
        {
          path: "/dashboard/email",
          element: (
            <ProtectedRoute requiredRole="General Manager">
              <SafeSuspense>
                <EmailLogsPage />
              </SafeSuspense>
            </ProtectedRoute>
          ),
        },
        {
          path: "/dashboard/waitlist",
          element: (
            <ProtectedRoute requiredRole="General Manager">
              <SafeSuspense>
                <WaitListEmails />
              </SafeSuspense>
            </ProtectedRoute>
          ),
        },

        // ------------------------
        // Coming Soon / Fallback
        // ------------------------
        {
          path: "/coming-soon",
          element: (
            <SafeSuspense>
              <ComingSoon />
            </SafeSuspense>
          ),
        },
        {
          path: "*",
          element: (
            <SafeSuspense>
              <NotFound />
            </SafeSuspense>
          ),
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
