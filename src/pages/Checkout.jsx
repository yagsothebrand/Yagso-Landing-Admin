import { useState } from "react";
import Header from "../layout/Header";
import Footer from "../layout/Footer";
import Cart from "../components/Cart";
import Banner from "@/layout/Banner";
import CheckoutPage from "@/components/CheckoutPage";

export default function Checkout() {
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState([]);

  const addToCart = (item) => {
    setCart([...cart, { ...item, id: Math.random() }]);
  };

  const removeFromCart = (id) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  return (
    <main className="bg-white/10 pt-20 md:pt-28">
      <Header />

      <CheckoutPage />
      <Footer />
    </main>
  );
}
