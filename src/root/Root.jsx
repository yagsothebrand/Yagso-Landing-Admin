import { AuthProvider } from "@/components/auth/AuthProvider";
import { BlogProvider } from "@/components/auth/BlogProvider";
import { LandingAuthProvider } from "@/components/auth/LandingAuthProvider";
import { OrdersProvider } from "@/components/auth/OrdersProvider";
import { ProductsProvider } from "@/components/auth/ProductsProvider";
import VideoLayout from "@/layouts/VideoLayout";
import { Outlet } from "react-router-dom";

const Root = () => {
  return (
    <LandingAuthProvider>
      <AuthProvider>
        <ProductsProvider>
          <OrdersProvider>
            <BlogProvider>
              {/* <VideoLayout> */}
                <Outlet />
              {/* </VideoLayout> */}
            </BlogProvider>
          </OrdersProvider>
        </ProductsProvider>
      </AuthProvider>
    </LandingAuthProvider>
  );
};

export default Root;
