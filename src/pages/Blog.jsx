import { useState } from "react";
import Header from "../layout/Header";
import BlogSection from "../components/BlogSection";
import Footer from "../layout/Footer";
import Cart from "../components/Cart";
import CTAFooter from "@/components/CTAFooter";

export default function Blog() {
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState([]);

  const addToCart = (item) => {
    setCart([...cart, { ...item, id: Math.random() }]);
  };

  const removeFromCart = (id) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  return (
    <main className="bg-white/10 pt-10 md:pt-24">
      <Header />
      {/* <BlogBanner /> */}

      {cartOpen && (
        <Cart
          items={cart}
          onClose={() => setCartOpen(false)}
          onRemove={removeFromCart}
        />
      )}

      <BlogSection />
      <CTAFooter />
      <Footer />
    </main>
  );
}
