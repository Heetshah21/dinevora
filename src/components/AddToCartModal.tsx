"use client";

import { useState } from "react";
import { addToCart } from "@/lib/cart";

export default function AddToCartModal({
  item,
  onClose,
}: {
  item: any;
  onClose: () => void;
}) {
  const [quantity, setQuantity] = useState(1);
  const [isJain, setIsJain] = useState(false);
  const [notes, setNotes] = useState("");

  const handleAdd = () => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      imageUrl: item.imageUrl,
      quantity,
      isJain,
      notes,
    });

    window.dispatchEvent(new Event("cartUpdated"));
    onClose();
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 9999,
        background: "rgba(0,0,0,0.35)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "18px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          background: "white",
          padding: "24px",
          borderRadius: "14px",
          boxShadow: "0 10px 40px rgba(0,0,0,0.15)",
          width: "320px",
          maxWidth: "100%",
          border: "1px solid rgba(229,231,235,0.9)",
          boxSizing: "border-box",
        }}
      >
        <h2 style={{ margin: "0 0 14px", fontSize: "18px", color: "#111827" }}>
          {item.name}
        </h2>

        {item.isJainAvailable && (
          <>
            <p style={{ margin: "0 0 8px", fontSize: "13px", color: "#6b7280", fontWeight: 600 }}>
              Choose Variant
            </p>
            <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", color: "#111827" }}>
              <input
                type="radio"
                checked={!isJain}
                onChange={() => setIsJain(false)}
              />
              Regular
            </label>

            <div style={{ height: "8px" }} />

            <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", color: "#111827" }}>
              <input
                type="radio"
                checked={isJain}
                onChange={() => setIsJain(true)}
              />
              Jain
            </label>
          </>
        )}

        <div style={{ marginTop: item.isJainAvailable ? "14px" : "6px" }}>
          <p style={{ margin: "0 0 8px", fontSize: "13px", color: "#6b7280", fontWeight: 600 }}>
            Quantity
          </p>
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <button
              onClick={() => setQuantity(quantity - 1)}
              type="button"
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "12px",
                border: "1px solid #e5e7eb",
                background: "#f9fafb",
                cursor: "pointer",
                fontSize: "16px",
                fontWeight: 800,
                color: "#111827",
              }}
            >
              -
            </button>
            <span style={{ minWidth: "28px", textAlign: "center", fontWeight: 800, color: "#111827" }}>
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              type="button"
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "12px",
                border: "1px solid #e5e7eb",
                background: "#f9fafb",
                cursor: "pointer",
                fontSize: "16px",
                fontWeight: 800,
                color: "#111827",
              }}
            >
              +
            </button>
          </div>
        </div>

        <textarea
          placeholder="Item note (less spicy, no onion...)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          style={{
            width: "100%",
            marginTop: "14px",
            padding: "12px",
            borderRadius: "12px",
            border: "1px solid #e5e7eb",
            boxSizing: "border-box",
            fontSize: "14px",
            color: "#111827",
            minHeight: "84px",
            resize: "vertical",
          }}
        />

        <button
          onClick={handleAdd}
          style={{
            width: "100%",
            marginTop: "14px",
            padding: "12px",
            background: "#111827",
            color: "white",
            border: "none",
            borderRadius: "12px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: 800,
          }}
        >
          Add To Cart
        </button>

        <button
          onClick={onClose}
          style={{
            width: "100%",
            marginTop: "10px",
            padding: "12px",
            background: "#ffffff",
            border: "1px solid #e5e7eb",
            borderRadius: "12px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: 700,
            color: "#111827",
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}