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
        bottom: "0",
        left: "0",
        right: "0",
        background: "#111",
        color: "white",
        padding: "15px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <span>{count} items • ₹{total} </span>

      <Link
        href={`/r/${restaurant}/cart`}
        style={{
          background: "white",
          color: "black",
          padding: "6px 12px",
          borderRadius: "6px",
          textDecoration: "none",
        }}
      >
        View Cart
      </Link>
    </div>
  );
}