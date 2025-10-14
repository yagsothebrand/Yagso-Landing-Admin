import "./App.css";
import "./index.css";
import { Suspense } from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Root from "./roots/roots";
import { LoadingHelper } from "./lib/LoadingHelper";
import { ProtectedRoute } from "./components/auth/protected-route";

// Public pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Protected pages
import AdminDashboard from "./components/layout/AdminDashboard";
import InvoicesPage from "./pages/InvoicesPage";
import { InventoryPage } from "./pages/InventoryPage";
import { BrandsPage } from "./pages/BrandsPage";
import { CategoryPage } from "./pages/CategoryPage";
import { AdministrationPage } from "./pages/AdministrationPage";
import { AnalyticsDashboard } from "./pages/AnalyticsDashboard";
import { EmailLogsPage } from "./pages/EmailLogsPage";
import ComingSoon from "./pages/ComingSoon";
import WaitlistForm from "./pages/landing/WaitListForm";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Root />,
      children: [
        // ------------------------
        // ✅ Public routes
        // ------------------------
        {
          index: true,
          element: (
            <Suspense fallback={<LoadingHelper />}>
              <WaitlistForm />
            </Suspense>
          ),
        },
        {
          path: "/login",
          element: (
            <Suspense fallback={<LoadingHelper />}>
              <Index />
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
          path: "/dashboard/inventory",
          element: (
            <Suspense fallback={<LoadingHelper />}>
              <ProtectedRoute requiredRole="Sales Representative">
                <InventoryPage />
              </ProtectedRoute>
            </Suspense>
          ),
        },
        {
          path: "/dashboard/brands",
          element: (
            <Suspense fallback={<LoadingHelper />}>
              <ProtectedRoute requiredRole="Sales Representative">
                <BrandsPage />
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
