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
import { CartProvider } from "@/components/cart/CartProvider";
import CartDrawer from "@/pages/CartDrawer";
import { LandingAuthProvider } from "@/components/landingauth/LandingAuthProvider";
import { CheckoutProvider } from "@/components/cart/CheckoutProvider";

const Root = () => {
  // const { user } = useAuth();
  return (
    <>
      {/* <Navbar /> */}
      <LandingAuthProvider>
        <NotificationProvider>
          <AuthProvider>
            <InvoiceProvider>
              <ProductsProvider>
                <CheckoutProvider>
                  <CartProvider>
                    <CartDrawer />
                    <Toaster />

                    <Outlet />
                  </CartProvider>
                </CheckoutProvider>
              </ProductsProvider>
            </InvoiceProvider>
          </AuthProvider>
        </NotificationProvider>
      </LandingAuthProvider>
      {/* <Footer /> */}
    </>
  );
};

export default Root;
