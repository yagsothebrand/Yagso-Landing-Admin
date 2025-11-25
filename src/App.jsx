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
    <ErrorBoundary
      fallback={<div>Something went wrong loading this page.</div>}
    >
      {children}
    </ErrorBoundary>
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
          path: "/:token",
          element: (
            <SafeSuspense>
              <TokenPage />
            </SafeSuspense>
          ),
        },

        // ------------------------
        // Protected routes
        // ------------------------
        {
          path: "/dashboard",
          element: (
            <SafeSuspense>
              <ProtectedRoute requiredRole="Sales Representative">
                <AdminDashboard />
              </ProtectedRoute>
            </SafeSuspense>
          ),
        },
        {
          path: "/dashboard/invoices",
          element: (
            <SafeSuspense>
              <ProtectedRoute requiredRole="Sales Representative">
                <InvoicesPage />
              </ProtectedRoute>
            </SafeSuspense>
          ),
        },
        {
          path: "/dashboard/products",
          element: (
            <SafeSuspense>
              <ProtectedRoute requiredRole="Sales Representative">
                <ProductsPage />
              </ProtectedRoute>
            </SafeSuspense>
          ),
        },
        {
          path: "/dashboard/categories",
          element: (
            <SafeSuspense>
              <ProtectedRoute requiredRole="Sales Representative">
                <CategoryPage />
              </ProtectedRoute>
            </SafeSuspense>
          ),
        },
        {
          path: "/dashboard/administration",
          element: (
            <SafeSuspense>
              <ProtectedRoute requiredRole="General Manager">
                <AdministrationPage />
              </ProtectedRoute>
            </SafeSuspense>
          ),
        },
        {
          path: "/dashboard/analytics",
          element: (
            <SafeSuspense>
              <ProtectedRoute requiredRole="General Manager">
                <AnalyticsDashboard />
              </ProtectedRoute>
            </SafeSuspense>
          ),
        },
        {
          path: "/dashboard/email",
          element: (
            <SafeSuspense>
              <ProtectedRoute requiredRole="General Manager">
                <EmailLogsPage />
              </ProtectedRoute>
            </SafeSuspense>
          ),
        },
        {
          path: "/dashboard/waitlist",
          element: (
            <SafeSuspense>
              <ProtectedRoute requiredRole="General Manager">
                <WaitListEmails />
              </ProtectedRoute>
            </SafeSuspense>
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
