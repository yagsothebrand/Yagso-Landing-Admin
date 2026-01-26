import { Routes, Route } from "react-router-dom";
import Root from "./root/Root";
import Shop from "./pages/Shop";
import Blog from "./pages/Blog";
import BlogDetailPage from "./components/BlogDetailPage";
import ProductPage from "./components/ProductPage";
import Checkout from "./pages/Checkout";
import Order from "./pages/Order";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Orders from "./pages/Orders";
import { CheckoutProvider } from "./components/auth/CheckoutProvider";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import UsersPage from "./components/UsersPage";
import HeroWaitlist from "./components/HeroWaitlist";
import Index from "./pages/Index";
import TokenGate from "./pages/TokenGate";
import CheckYourEmailPage from "./pages/CheckYourEmailPage";
import RequireWaitlistAccess from "./components/RequireWaitlistAccess";
// import NotFound from "./pages/NotFound";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Root />}>
        {/* public */}
        <Route path="waitlist" element={<HeroWaitlist />} />
        <Route path=":tokenId" element={<TokenGate />} />
        <Route path="check-your-email" element={<CheckYourEmailPage />} />

        {/* protected */}
        <Route element={<RequireWaitlistAccess />}>
          <Route index element={<Index />} />
          <Route path="shop" element={<Shop />} />
          <Route path="blog" element={<Blog />} />
          <Route path="login" element={<Login />} />
          <Route path="contact" element={<Contact />} />
          <Route path="privacy-policy" element={<PrivacyPolicy />} />
          <Route path="terms-and-conditions" element={<TermsOfService />} />
          <Route path="about" element={<About />} />
          <Route path="profile" element={<Profile />} />

          <Route path="users" element={<UsersPage />} />
          <Route path="orders" element={<Orders />} />
          <Route path="blog/:id" element={<BlogDetailPage />} />
          <Route path="product/:id" element={<ProductPage />} />
          <Route
            path="checkout"
            element={
              <CheckoutProvider>
                <Checkout />
              </CheckoutProvider>
            }
          />
          <Route
            path="order-success"
            element={
              <CheckoutProvider>
                <Order />
              </CheckoutProvider>
            }
          />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
