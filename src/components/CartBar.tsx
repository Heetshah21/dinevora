"use client";

import { useEffect, useState } from "react";
import { getCartCount, getCartTotal } from "@/lib/cart";
import Link from "next/link";

export default function CartBar({ restaurant  }: { restaurant : string }) {
  const [count, setCount] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const updateCart = () => {
      setCount(getCartCount());
      setTotal(getCartTotal());
    };

    updateCart();

    window.addEventListener("cartUpdated", updateCart);

    return () => {
      window.removeEventListener("cartUpdated", updateCart);
    };
  }, []);

  if (count === 0) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: "12px",
        left: "12px",
        right: "12px",
        background: "rgba(255,255,255,0.72)",
        color: "#111827",
        padding: "14px 16px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderRadius: "12px",
        border: "1px solid rgba(229,231,235,0.9)",
        backdropFilter: "blur(10px)",
        boxShadow: "0 4px 14px rgba(0,0,0,0.06)",
        boxSizing: "border-box",
        zIndex: 50,
      }}
    >
      <span style={{ color: "#374151", fontSize: "15px", fontWeight: 600 }}>
        {count} items • ₹{total}
      </span>

      <Link
        href={`/r/${restaurant}/cart`}
        style={{
          background: "#111827",
          color: "white",
          padding: "12px 18px",
          borderRadius: "12px",
          textDecoration: "none",
          border: "1px solid #111827",
          fontSize: "15px",
          fontWeight: 700,
          boxShadow: "0 4px 14px rgba(0,0,0,0.06)",
        }}
      >
        View Cart
      </Link>
    </div>
  );
}