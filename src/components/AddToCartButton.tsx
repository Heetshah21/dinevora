"use client";

import { useEffect, useState } from "react";
import { addToCart, removeFromCart, getCart } from "@/lib/cart";
import AddToCartModal from "@/components/AddToCartModal";

export default function AddToCartButton({ item }: any) {
  const [showModal, setShowModal] = useState(false);
  const [qty, setQty] = useState(0);

  // Sync quantity from cart
  useEffect(() => {
    const updateQty = () => {
      const items = getCart();
      const existing = items.find(
        (i: any) => i.id === item.id && i.isJain === false
      );
      setQty(existing ? existing.quantity : 0);
    };

    updateQty();

    window.addEventListener("cartUpdated", updateQty);
    return () => {
      window.removeEventListener("cartUpdated", updateQty);
    };
  }, [item.id]);

  const handleAdd = () => {
    if (item.isJainAvailable) {
      setShowModal(true);
    } else {
      addToCart({
        id: item.id,
        name: item.name,
        price: item.price,
        imageUrl: item.imageUrl || undefined,
        quantity: 1,
        isJain: false,
        notes: "",
      });

      window.dispatchEvent(new Event("cartUpdated"));
    }
  };

  // 🔥 ADD BUTTON
  if (qty === 0) {
    return (
      <>
        <button
          type="button"
          onClick={handleAdd}
          style={{
            padding: "8px 16px",
            minWidth: "72px",              // prevents layout jump
            textAlign: "center",
            background: "#111827",
            color: "white",
            border: "none",
            borderRadius: "10px",
            fontSize: "14px",
            cursor: "pointer",
            fontWeight: 600,
            touchAction: "manipulation", // better mobile tap
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
          }}
        >
          Add
        </button>

        {showModal && (
          <AddToCartModal
            item={item}
            onClose={() => setShowModal(false)}
          />
        )}
      </>
    );
  }

  // 🔥 QUANTITY CONTROLS
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "6px",
        background: "#eef2ff",                // matches category theme
        border: "1px solid #c7d2fe",
        borderRadius: "10px",
        padding: "4px 6px",
      }}
    >
      {/* MINUS */}
      <button
        onClick={() => {
          removeFromCart(item.id, false);
          window.dispatchEvent(new Event("cartUpdated"));
        }}
        style={{
          border: "none",
          background: "white",
          width: "32px",
          height: "32px",
          borderRadius: "6px",
          cursor: "pointer",
          fontSize: "18px",
          fontWeight: 600,
          touchAction: "manipulation",
        }}
      >
        −
      </button>

      {/* QTY */}
      <span
        style={{
          fontWeight: 600,
          minWidth: "20px",
          textAlign: "center",
          fontSize: "14px",
        }}
      >
        {qty}
      </span>

      {/* PLUS */}
      <button
        onClick={handleAdd}
        style={{
          border: "none",
          background: "white",
          width: "32px",
          height: "32px",
          borderRadius: "6px",
          cursor: "pointer",
          fontSize: "18px",
          fontWeight: 600,
          touchAction: "manipulation",
        }}
      >
        +
      </button>

      {showModal && (
        <AddToCartModal
          item={item}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}