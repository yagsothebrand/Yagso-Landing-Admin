import { useState } from "react";
import Header from "../layout/Header";
import Footer from "../layout/Footer";
import Cart from "../components/Cart";
import ProductDetailsPage from "./ProductDetailsPage";

export default function ProductPage() {
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState([]);

  const addToCart = (item) => {
    setCart([...cart, { ...item, id: Math.random() }]);
  };

  const removeFromCart = (id) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  return (
    <main>
      <Header />

      {cartOpen && (
        <Cart
          items={cart}
          onClose={() => setCartOpen(false)}
          onRemove={removeFromCart}
        />
      )}

      <ProductDetailsPage />
      <Footer />
    </main>
  );
}
