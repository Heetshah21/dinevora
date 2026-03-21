"use client";

import { useState } from "react";
import { updateMenuItem, toggleItemAvailability } from "./actions";

interface Props {
    tenant: string;
    item: {
      id: string;
      name: string;
      price: string;
      description: string | null;
      isJainAvailable: boolean;
      imageUrl: string | null;
      isAvailable: boolean;
    };
  }

export default function MenuItemCard({ item, tenant }: Props) {
  const [editing, setEditing] = useState(false);

  if (editing) {
    return (
      <form
        action={async (formData: FormData) => {
          await updateMenuItem(tenant, formData);
          setEditing(false);
        }}
        encType="multipart/form-data"
        style={{
          border: "1px solid #e5e7eb",
          padding: "14px",
          marginTop: "10px",
          borderRadius: "10px",
          background: "#fff",
        }}
      >
        <input
          name="name"
          defaultValue={item.name}
          required
          style={{
            marginRight: "8px",
            padding: "10px 12px",
            borderRadius: "8px",
            border: "1px solid #d1d5db",
            marginBottom: "8px",
          }}
        />
        
        <input type="hidden" name="itemId" value={item.id} />
        <div style={{ marginTop: "8px" }}>
        <label>Update Image</label>
        <br />
        <input type="file" name="image" accept="image/*" />
      </div>
              
        <input
          name="price"
          type="number"
          step="0.01"
          defaultValue={item.price}
          style={{
            padding: "10px 12px",
            borderRadius: "8px",
            border: "1px solid #d1d5db",
            marginBottom: "8px",
            marginRight: "8px",
          }}
        />
  
        <input
          name="description"
          defaultValue={item.description || ""}
          style={{
            padding: "10px 12px",
            borderRadius: "8px",
            border: "1px solid #d1d5db",
            marginBottom: "8px",
          }}
        />
  
        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            marginTop: "6px",
          }}
        >
          <input
            type="checkbox"
            name="isJainAvailable"
            defaultChecked={item.isJainAvailable}
          />
          Jain
        </label>
  
        <div style={{ marginTop: "8px" }}>
          <button
            type="button"
            onClick={() => setEditing(false)}
            style={{
              padding: "8px 12px",
              borderRadius: "8px",
              border: "1px solid #d1d5db",
              background: "#fff",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
  
          <button
            type="submit"
            style={{
              marginLeft: "10px",
              background: "#111827",
              color: "white",
              border: "none",
              padding: "8px 12px",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            Save
          </button>
        </div>
      </form>
    );
  }

  return (
    <div
      style={{
        border: "1px solid #e5e7eb",
        padding: "14px",
        marginTop: "10px",
        borderRadius: "10px",
        opacity: item.isAvailable ? 1 : 0.5,
        background: item.isAvailable ? "white" : "#f9fafb",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: "12px",
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px", minWidth: "220px" }}>
        {item.imageUrl && (
          <img
            src={item.imageUrl}
            style={{
              width: "56px",
              height: "56px",
              objectFit: "cover",
              borderRadius: "8px",
            }}
          />
        )}
          <div>
            <strong style={{ display: "block", marginBottom: "2px", color: "#111827" }}>{item.name}</strong>
            <span style={{ color: "#374151", fontSize: "14px" }}>₹{item.price.toString()}</span>
          </div>

          {item.isJainAvailable && (
            <span
              style={{
                padding: "3px 8px",
                background: "#ecfdf3",
                color: "#166534",
                borderRadius: "6px",
                fontSize: "12px",
                border: "1px solid #bbf7d0",
              }}
            >
              Jain Available
            </span>
          )}
        </div>

        <div style={{ display: "flex", gap: "8px" }}>
          <button
            onClick={() => setEditing(true)}
            style={{
              padding: "8px 12px",
              background: "#111827",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "13px",
            }}
          >
            Edit
          </button>
        </div>
      </div>

      <p style={{ margin: "10px 0 0", color: "#4b5563", fontSize: "14px" }}>
        {item.description}
      </p>
      <form
        action={async (formData: FormData) => {
            await toggleItemAvailability(tenant, formData);
        }}
        style={{ marginTop: "6px" }}
        >
        <input type="hidden" name="itemId" value={item.id} />

        <label
            style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            fontSize: "13px",
            color: "#374151",
            }}
        >
            <input
            type="checkbox"
            name="isAvailable"
            defaultChecked={item.isAvailable}
            onChange={(e) => e.currentTarget.form?.requestSubmit()}
            />
            Available
        </label>
        </form>
    </div>
  );
}