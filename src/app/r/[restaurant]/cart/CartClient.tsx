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
  const [orderType, setOrderType] = useState("TAKEAWAY");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");

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

  const isDineIn = tableNumber ? true : false;

  const placeOrder = async () => {
    if (!isDineIn) {
      if (!customerName || !customerPhone) {
        alert("Please enter name and phone number");
        return;
      }
  
      if (orderType === "DELIVERY" && !deliveryAddress) {
        alert("Please enter delivery address");
        return;
      }
    }
  
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
        orderType: isDineIn ? "IN_STORE" : orderType,
        customerName: customerName,
        customerPhone: customerPhone,
        deliveryAddress: deliveryAddress,
      })
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
    <div
      style={{
        padding: "20px",
        maxWidth: "720px",
        margin: "0 auto",
        paddingBottom: "120px",
        background: "#f5f6f8",
        borderRadius: "12px",
        boxShadow: "0 4px 14px rgba(0,0,0,0.06)",
        boxSizing: "border-box",
      }}
    >
      <a
        href={`/r/${restaurant}/menu`}
        style={{
          display: "inline-block",
          marginBottom: "20px",
          textDecoration: "none",
          color: "#111827",
          fontWeight: 500,
        }}
      >
        ← Back to Menu
      </a>

      <h1 style={{ marginBottom: "20px", color: "#111827" }}>Your Cart</h1>

      {cart.length === 0 && <p>Cart is empty</p>}

      {cart.map((item) => (
        <div
          key={item.id + (item.isJain ? "-jain" : "")}
          style={{
            display: "flex",
            gap: "10px",
            border: "1px solid #e5e7eb",
            padding: "14px",
            borderRadius: "12px",
            marginBottom: "12px",
            background: "white",
            boxSizing: "border-box",
            boxShadow: "0 4px 14px rgba(0,0,0,0.06)",
          }}
        >
          {item.imageUrl && (
            <img
              src={item.imageUrl}
              style={{
                width: "60px",
                height: "60px",
                objectFit: "cover",
                borderRadius: "12px",
              }}
            />
          )}

          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
              <strong style={{ color: "#111827", fontSize: "15px" }}>{item.name}</strong>
              {item.isJain && (
                <span
                  style={{
                    display: "inline-flex",
                    padding: "3px 8px",
                    borderRadius: "999px",
                    fontSize: "12px",
                    background: "#ecfdf3",
                    border: "1px solid #bbf7d0",
                    color: "#166534",
                    fontWeight: 600,
                  }}
                >
                  Jain
                </span>
              )}
            </div>

            <p style={{ margin: "6px 0 0", color: "#111827", fontWeight: 600 }}>₹{item.price}</p>

            {item.notes && (
              <p style={{ fontSize: "12px", color: "#6b7280", margin: "6px 0 0" }}>
                Note: {item.notes}
              </p>
            )}

            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "10px" }}>
              <button
                onClick={() =>
                  changeQty(item.id, item.quantity - 1, item.isJain)
                }
                type="button"
                style={{
                  width: "34px",
                  height: "34px",
                  borderRadius: "12px",
                  border: "1px solid #e5e7eb",
                  background: "#f9fafb",
                  cursor: "pointer",
                  fontSize: "16px",
                  color: "#111827",
                  fontWeight: 700,
                  boxShadow: "0 4px 14px rgba(0,0,0,0.06)",
                }}
              >
                -
              </button>

              <span style={{ minWidth: "24px", textAlign: "center", color: "#111827", fontWeight: 600 }}>
                {item.quantity}
              </span>

              <button
                onClick={() =>
                  changeQty(item.id, item.quantity + 1, item.isJain)
                }
                type="button"
                style={{
                  width: "34px",
                  height: "34px",
                  borderRadius: "12px",
                  border: "1px solid #e5e7eb",
                  background: "#f9fafb",
                  cursor: "pointer",
                  fontSize: "16px",
                  color: "#111827",
                  fontWeight: 700,
                  boxShadow: "0 4px 14px rgba(0,0,0,0.06)",
                }}
              >
                +
              </button>
            </div>
          </div>
        </div>
      ))}

      {cart.length > 0 && (
        <div
          style={{
            border: "1px solid #e5e7eb",
            borderRadius: "12px",
            padding: "16px",
            background: "#fff",
            boxSizing: "border-box",
            marginTop: "8px",
            boxShadow: "0 4px 14px rgba(0,0,0,0.06)",
          }}
        >
          <h2 style={{ margin: 0, color: "#111827", fontSize: "18px" }}>
            Total: ₹{getTotal()}
          </h2>

          <textarea
            placeholder="Special instructions (less spicy, no onion, etc.)"
            value={orderNotes}
            onChange={(e) => setOrderNotes(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              marginTop: "12px",
              borderRadius: "12px",
              border: "1px solid #e5e7eb",
              fontSize: "14px",
              color: "#111827",
              boxSizing: "border-box",
              minHeight: "92px",
              boxShadow: "0 4px 14px rgba(0,0,0,0.06)",
            }}
          />

          {!isDineIn && (
            <>
              <h3
                style={{
                  marginTop: "18px",
                  marginBottom: "8px",
                  color: "#111827",
                  fontSize: "14px",
                }}
              >
                Order Type
              </h3>

              <select
                value={orderType}
                onChange={(e) => setOrderType(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "12px",
                  border: "1px solid #e5e7eb",
                  marginTop: "6px",
                  fontSize: "14px",
                  boxShadow: "0 4px 14px rgba(0,0,0,0.06)",
                }}
              >
                <option value="TAKEAWAY">Takeaway</option>
                <option value="DELIVERY">Delivery</option>
              </select>

              <input
                placeholder="Your Name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px",
                  marginTop: "10px",
                  borderRadius: "12px",
                  border: "1px solid #e5e7eb",
                  fontSize: "14px",
                  boxSizing: "border-box",
                  boxShadow: "0 4px 14px rgba(0,0,0,0.06)",
                }}
              />

              <input
                placeholder="Phone Number"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px",
                  marginTop: "10px",
                  borderRadius: "12px",
                  border: "1px solid #e5e7eb",
                  fontSize: "14px",
                  boxSizing: "border-box",
                  boxShadow: "0 4px 14px rgba(0,0,0,0.06)",
                }}
              />

              {orderType === "DELIVERY" && (
                <textarea
                  placeholder="Delivery Address"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px",
                    marginTop: "10px",
                    borderRadius: "12px",
                    border: "1px solid #e5e7eb",
                    fontSize: "14px",
                    boxSizing: "border-box",
                    minHeight: "92px",
                    boxShadow: "0 4px 14px rgba(0,0,0,0.06)",
                  }}
                />
              )}
            </>
          )}

          <button
            onClick={placeOrder}
            style={{
              width: "100%",
              padding: "14px",
              background: "#111827",
              color: "white",
              border: "none",
              borderRadius: "12px",
              marginTop: "18px",
              fontSize: "16px",
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: "0 4px 14px rgba(0,0,0,0.06)",
            }}
          >
            Place Order
          </button>
        </div>
      )}
    </div>
  );
}