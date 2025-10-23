import { Outlet } from "react-router-dom";
// import Footer from "../components/layouts/Footer";
// import Navbar from "../components/layouts/Navbar";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorPage } from "@/pages/ErrorPage";
import { NotificationProvider } from "@/components/notification/NotificationProvider";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { InvoiceProvider } from "@/components/invoice/InvoiceProvider";
import { ProductsProvider } from "@/components/products/ProductsProvider";
import { Toaster } from "@/components/ui/toaster";

const Root = () => {
  // const { user } = useAuth();
  return (
    <>
      {/* <Navbar /> */}
      <NotificationProvider>
        <AuthProvider>
          <InvoiceProvider>
            <ProductsProvider>
              <Toaster />

              <ErrorBoundary FallbackComponent={ErrorPage}>
                <Outlet />
              </ErrorBoundary>
            </ProductsProvider>
          </InvoiceProvider>
        </AuthProvider>
      </NotificationProvider>
      {/* <Footer /> */}
    </>
  );
};

export default Root;
