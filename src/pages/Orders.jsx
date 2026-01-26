import { useState } from "react";
import Header from "../layout/Header";
import Footer from "../layout/Footer";
import Cart from "../components/Cart";
import { useNavigate } from "react-router-dom";
import ProfilePage from "@/components/ProfilePage";
import OrdersPage from "@/components/OrdersPage";

export default function Orders() {
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
    <main className="bg-white/10">
      <Header />
      {/* <BlogBanner /> */}

      {cartOpen && (
        <Cart
          items={cart}
          onClose={() => setCartOpen(false)}
          onRemove={removeFromCart}
        />
      )}

      <OrdersPage />
      <Footer />
    </main>
  );
}
