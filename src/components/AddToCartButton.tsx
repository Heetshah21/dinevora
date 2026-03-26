"use client";

import { useState } from "react";
import { addToCart } from "@/lib/cart";
import AddToCartModal from "@/components/AddToCartModal";

export default function AddToCartButton({ item }: any) {
  const [showModal, setShowModal] = useState(false);

  const handleAddClick = () => {
    console.log("ITEM:", item);
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

  return (
    <>
      <button
        type="button"
        onClick={handleAddClick}
        style={{
          height: "40px",
          alignSelf: "center",
          background: "#111827",
          color: "white",
          border: "none",
          borderRadius: "12px",
          padding: "0 16px",
          cursor: "pointer",
          fontSize: "14px",
          fontWeight: 600,
          whiteSpace: "nowrap",
          boxShadow: "0 4px 14px rgba(0,0,0,0.06)",
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