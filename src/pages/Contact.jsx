import { useState } from "react";
import Header from "../layout/Header";
import BlogSection from "../components/BlogSection";
import Footer from "../layout/Footer";
import Cart from "../components/Cart";
import ContactSection from "@/components/ContactSection";
import { useNavigate } from "react-router-dom";

export default function Contact() {
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();
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

      <ContactSection />
      <Footer />
    </main>
  );
}
