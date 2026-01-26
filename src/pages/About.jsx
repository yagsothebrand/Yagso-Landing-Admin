import { useState } from "react";
import Header from "../layout/Header";
import BlogSection from "../components/BlogSection";
import Footer from "../layout/Footer";
import Cart from "../components/Cart";
import WhyChooseUs from "@/components/WhyChooseUs";

export default function About() {
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState([]);

  const addToCart = (item) => {
    setCart([...cart, { ...item, id: Math.random() }]);
  };

  const removeFromCart = (id) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  return (
    <main className="pt-24">
      <Header />
      {/* <BlogBanner /> */}

      {cartOpen && (
        <Cart
          items={cart}
          onClose={() => setCartOpen(false)}
          onRemove={removeFromCart}
        />
      )}

      <WhyChooseUs />
      <Footer />
    </main>
  );
}
