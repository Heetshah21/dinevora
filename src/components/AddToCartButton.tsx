"use client";

import { useEffect, useState } from "react";
import { addToCart, removeFromCart, getCartItems } from "@/lib/cart";
import AddToCartModal from "@/components/AddToCartModal";

export default function AddToCartButton({ item }: any) {
  const [showModal, setShowModal] = useState(false);
  const [qty, setQty] = useState(0);

  // Sync quantity from cart on load + updates
  useEffect(() => {
    const updateQty = () => {
      const items = getCartItems();
      const existing = items.find((i: any) => i.id === item.id);
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

  // 🔥 UI SWITCH
  if (qty === 0) {
    return (
      <>
        <button
          type="button"
          onClick={handleAdd}
          style={{
            padding: "6px 12px",
            background: "#111827",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "13px",
            cursor: "pointer",
            fontWeight: 600,
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

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "6px",
        background: "#f3f4f6",
        borderRadius: "10px",
        padding: "4px 6px",
      }}
    >
      <button
        onClick={() => {
          removeFromCart(item.id);
          window.dispatchEvent(new Event("cartUpdated"));
        }}
        style={{
          border: "none",
          background: "white",
          width: "26px",
          height: "26px",
          borderRadius: "6px",
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
        -
      </button>

      <span style={{ fontWeight: 600, minWidth: "16px", textAlign: "center" }}>
        {qty}
      </span>

      <button
        onClick={handleAdd}
        style={{
          border: "none",
          background: "white",
          width: "26px",
          height: "26px",
          borderRadius: "6px",
          cursor: "pointer",
          fontWeight: "bold",
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