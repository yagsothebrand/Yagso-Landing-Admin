import { useState } from "react";
import Header from "../layout/Header";
import Footer from "../layout/Footer";
import Cart from "../components/Cart";
import Banner from "@/layout/Banner";
import CheckoutPage from "@/components/CheckoutPage";
import OrderSuccessPage from "@/components/OrderSuccessPage";

export default function Order() {
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState([]);

  const addToCart = (item) => {
    setCart([...cart, { ...item, id: Math.random() }]);
  };

  const removeFromCart = (id) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  return (
    <main className="bg-white/10  pt-5 md:pt-20">
      <Header />
      {/* <Banner /> */}

      {cartOpen && (
        <Cart
          items={cart}
          onClose={() => setCartOpen(false)}
          onRemove={removeFromCart}
        />
      )}

      <OrderSuccessPage />
      <Footer />
    </main>
  );
}
