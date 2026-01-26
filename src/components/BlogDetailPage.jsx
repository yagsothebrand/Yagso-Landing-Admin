import { useState } from "react";
import Header from "../layout/Header";
import Hero from "../components/Hero";
import Products from "../components/Products";
import WhyChooseUs from "../components/WhyChooseUs";
import BlogDetail from "../components/BlogDetail";
import Footer from "../layout/Footer";
import Cart from "../components/Cart";
import Banner from "@/layout/Banner";
import BlogBanner from "@/layout/BlogBanner";

export default function BlogDetailPage() {
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState([]);

  const addToCart = (item) => {
    setCart([...cart, { ...item, id: Math.random() }]);
  };

  const removeFromCart = (id) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  return (
    <main className="bg-white/10">
      <Header />

      {cartOpen && (
        <Cart
          items={cart}
          onClose={() => setCartOpen(false)}
          onRemove={removeFromCart}
        />
      )}

      <BlogDetail />
      <Footer />
    </main>
  );
}
