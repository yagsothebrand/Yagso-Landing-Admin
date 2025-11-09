import "./App.css";
import "./index.css";
import { Suspense, lazy } from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Root from "./roots/roots";
import { LoadingHelper } from "./lib/LoadingHelper";
import { ProtectedRoute } from "./components/auth/protected-route";

// Public pages
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
