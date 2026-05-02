"use client";

import { useState } from "react";
import AddToCartButton from "@/components/AddToCartButton";

export default function CustomerMenuClient({ categories }: any) {
  const [openCategory, setOpenCategory] = useState<string | null>(null);

  const toggleCategory = (id: string) => {
    setOpenCategory((prev) => (prev === id ? null : id));
  };

  return (
    <>
      {categories.map((category: any) => {
        const isOpen = openCategory === category.id;

        return (
          <div key={category.id} style={{ marginBottom: "18px" }}>
            {/* CATEGORY HEADER */}
            <div
              onClick={() => toggleCategory(category.id)}
              style={{
                cursor: "pointer",
                padding: "12px",
                background: "#ffffff",
                borderRadius: "10px",
                border: "1px solid #e5e7eb",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
              }}
            >
              <h2 style={{ margin: 0, fontSize: "16px" }}>
                {category.name}
              </h2>

              <span style={{ fontSize: "14px" }}>
                {isOpen ? "▲" : "▼"}
              </span>
            </div>

            {/* ITEMS */}
            {isOpen && (
              <div style={{ marginTop: "10px", display: "grid", gap: "12px" }}>
                {category.menuItems.map((item: any) => (
                  <div
                    key={item.id}
                    style={{
                      display: "flex",
                      gap: "12px",
                      padding: "12px",
                      border: "1px solid #e5e7eb",
                      borderRadius: "10px",
                      background: "#fff",
                      alignItems: "center",
                    }}
                  >
                    {item.imageUrl && (
                      <img
                        src={item.imageUrl}
                        style={{
                          width: "70px",
                          height: "70px",
                          borderRadius: "10px",
                          objectFit: "cover",
                        }}
                      />
                    )}

                    <div
                      style={{
                        flex: 1,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      {/* LEFT */}
                      <div>
                        <strong style={{ fontSize: "14px" }}>
                          {item.name}
                        </strong>

                        {item.description && (
                          <p style={{ fontSize: "12px" }}>
                            {item.description}
                          </p>
                        )}

                        <div style={{ fontWeight: 700 }}>
                          ₹{item.price.toString()}
                        </div>
                      </div>

                      {/* RIGHT */}
                      <AddToCartButton
                        item={{
                          id: item.id,
                          name: item.name,
                          price: Number(item.price),
                          imageUrl: item.imageUrl,
                          isJainAvailable: item.isJainAvailable,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </>
  );
}