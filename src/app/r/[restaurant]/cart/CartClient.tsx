"use client";

import { useEffect, useState } from "react";
import {
  getCart,
  updateQuantity,
  removeFromCart,
} from "@/lib/cart";

export default function CartClient({ restaurant }: { restaurant: string }) {
  const [cart, setCart] = useState<any[]>([]);
  const [orderNotes, setOrderNotes] = useState("");

  const loadCart = () => {
    setCart(getCart());
  };

  useEffect(() => {
    loadCart();
  }, []);

  const changeQty = (id: string, qty: number, isJain?: boolean) => {
    if (qty <= 0) {
      removeFromCart(id, isJain);
    } else {
      updateQuantity(id, qty, isJain);
    }

    loadCart();
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const getTotal = () => {
    return cart.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const tableNumber =
    typeof window !== "undefined"
      ? localStorage.getItem("servora_table")
      : null;

  const placeOrder = async () => {
    const res = await fetch("/api/orders/place", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        restaurantSlug: restaurant,
        items: cart,
        orderNotes: orderNotes,
        tableNumber: tableNumber,
      }),
    });

    const data = await res.json();
    console.log("ORDER RESPONSE:", data);

    if (data.orderId) {
      localStorage.removeItem("servora_cart");
      localStorage.removeItem("servora_table");
      window.location.href = `/r/${restaurant}/order/${data.orderId}`;
    } else {
      alert("Order creation failed");
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <a
        href={`/r/${restaurant}/menu`}
        style={{
          display: "inline-block",
          marginBottom: "20px",
          textDecoration: "none",
          color: "#111",
        }}
      >
        ← Back to Menu
      </a>

      <h1 style={{ marginBottom: "20px" }}>Your Cart</h1>

      {cart.length === 0 && <p>Cart is empty</p>}

      {cart.map((item) => (
        <div
          key={item.id + (item.isJain ? "-jain" : "")}
          style={{
            display: "flex",
            gap: "10px",
            border: "1px solid #eee",
            padding: "10px",
            borderRadius: "8px",
            marginBottom: "10px",
            background: "white",
          }}
        >
          {item.imageUrl && (
            <img
              src={item.imageUrl}
              style={{
                width: "60px",
                height: "60px",
                objectFit: "cover",
                borderRadius: "6px",
              }}
            />
          )}

          <div style={{ flex: 1 }}>
            <strong>
              {item.name}
              {item.isJain && (
                <span style={{ color: "green", marginLeft: "6px" }}>
                  (Jain)
                </span>
              )}
            </strong>

            <p>₹{item.price}</p>

            {item.notes && (
              <p style={{ fontSize: "12px", color: "#666" }}>
                Note: {item.notes}
              </p>
            )}

            <div style={{ display: "flex", gap: "10px", marginTop: "5px" }}>
              <button
                onClick={() =>
                  changeQty(item.id, item.quantity - 1, item.isJain)
                }
              >
                -
              </button>

              <span>{item.quantity}</span>

              <button
                onClick={() =>
                  changeQty(item.id, item.quantity + 1, item.isJain)
                }
              >
                +
              </button>
            </div>
          </div>
        </div>
      ))}

      {cart.length > 0 && (
        <>
          <h2>Total: ₹{getTotal()}</h2>

          <textarea
            placeholder="Special instructions (less spicy, no onion, etc.)"
            value={orderNotes}
            onChange={(e) => setOrderNotes(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              marginTop: "15px",
              borderRadius: "8px",
              border: "1px solid #ddd",
            }}
          />

          <button
            onClick={placeOrder}
            style={{
              width: "100%",
              padding: "14px",
              background: "#111",
              color: "white",
              border: "none",
              borderRadius: "8px",
              marginTop: "20px",
              fontSize: "16px",
              cursor: "pointer",
            }}
          >
            Place Order
          </button>
        </>
      )}
    </div>
  );
}