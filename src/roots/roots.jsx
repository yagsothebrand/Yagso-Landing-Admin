import { Outlet } from "react-router-dom";
// import Footer from "../components/layouts/Footer";
// import Navbar from "../components/layouts/Navbar";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorPage } from "@/pages/ErrorPage";
import { NotificationProvider } from "@/components/notification/NotificationProvider";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { InvoiceProvider } from "@/components/invoice/InvoiceProvider";
import { InventoryProvider } from "@/components/inventory/InventoryProvider";
import SidebarWrapper from "@/components/layout/SidebarWrapper";
import { Header } from "@/components/layout/Header";
import { StockMonitor } from "@/components/stock-monitor";
import { Toaster } from "@/components/ui/toaster";

const Root = () => {
  // const { user } = useAuth();
  return (
    <>
      {/* <Navbar /> */}
      <NotificationProvider>
        <AuthProvider>
          <InvoiceProvider>
            <InventoryProvider>
              <Toaster />
         
              <ErrorBoundary FallbackComponent={ErrorPage}>
                <Outlet />
              </ErrorBoundary>
            </InventoryProvider>
          </InvoiceProvider>
        </AuthProvider>
      </NotificationProvider>
      {/* <Footer /> */}
    </>
  );
};

export default Root;
