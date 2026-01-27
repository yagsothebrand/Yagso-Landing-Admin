import { useState } from "react";
import Header from "../layout/Header";
import Hero from "../components/Hero";
import Products from "../components/Products";
import WhyChooseUs from "../components/WhyChooseUs";
import BlogSection from "../components/BlogSection";
import Footer from "../layout/Footer";
import Cart from "../components/Cart";
import Banner from "@/layout/Banner";

export default function Shop() {
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState([]);

  const addToCart = (item) => {
    setCart([...cart, { ...item, id: Math.random() }]);
  };

  const removeFromCart = (id) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  return (
    <main className=" pt-10 md:pt-24">
      <Header />
      {/* <Banner /> */}

      {cartOpen && (
        <Cart
          items={cart}
          onClose={() => setCartOpen(false)}
          onRemove={removeFromCart}
        />
      )}

      <Products onAddToCart={addToCart} />
      <Footer />
    </main>
  );
}
