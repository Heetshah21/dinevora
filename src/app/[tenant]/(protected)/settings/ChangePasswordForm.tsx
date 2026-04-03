"use client";

import { useState } from "react";
import { changePassword } from "./password-actions";

export default function ChangePasswordForm({ tenant }: { tenant: string }) {
  const [message, setMessage] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  async function handleSubmit(formData: FormData) {
    const res = await changePassword(tenant, formData);

    if (res?.success) {
      setMessage("Password changed successfully");

      // Clear fields
      (document.getElementById("currentPassword") as HTMLInputElement).value = "";
      (document.getElementById("newPassword") as HTMLInputElement).value = "";
      (document.getElementById("confirmPassword") as HTMLInputElement).value = "";
    } else {
      setMessage(res?.error || "Error changing password");
    }
  }

  return (
    <div
      style={{
        marginTop: "30px",
        background: "#fff",
        border: "1px solid #e5e7eb",
        borderRadius: "10px",
        padding: "16px",
        maxWidth: "720px",
      }}
    >
      <h2 style={{ marginBottom: "12px", fontSize: "18px" }}>
        Change Password
      </h2>

      <form action={handleSubmit} style={{ display: "grid", gap: "12px", maxWidth: "400px" }}>
        
        <div style={{ position: "relative" }}>
          <input
            id="currentPassword"
            type={showCurrent ? "text" : "password"}
            name="currentPassword"
            placeholder="Current Password"
            style={{
              padding: "10px 12px",
              borderRadius: "8px",
              border: "1px solid #d1d5db",
              width: "100%",
            }}
            required
          />
          <span
            onClick={() => setShowCurrent(!showCurrent)}
            style={{
              position: "absolute",
              right: "10px",
              top: "50%",
              transform: "translateY(-50%)",
              cursor: "pointer",
              fontSize: "12px",
            }}
          >
            👁
          </span>
        </div>

        <div style={{ position: "relative" }}>
          <input
            id="newPassword"
            type={showNew ? "text" : "password"}
            name="newPassword"
            placeholder="New Password"
            style={{
              padding: "10px 12px",
              borderRadius: "8px",
              border: "1px solid #d1d5db",
              width: "100%",
            }}
            required
          />
          <span
            onClick={() => setShowNew(!showNew)}
            style={{
              position: "absolute",
              right: "10px",
              top: "50%",
              transform: "translateY(-50%)",
              cursor: "pointer",
              fontSize: "12px",
            }}
          >
            👁
          </span>
        </div>

        <div style={{ position: "relative" }}>
          <input
            id="confirmPassword"
            type={showConfirm ? "text" : "password"}
            name="confirmPassword"
            placeholder="Confirm New Password"
            style={{
              padding: "10px 12px",
              borderRadius: "8px",
              border: "1px solid #d1d5db",
              width: "100%",
            }}
            required
          />
          <span
            onClick={() => setShowConfirm(!showConfirm)}
            style={{
              position: "absolute",
              right: "10px",
              top: "50%",
              transform: "translateY(-50%)",
              cursor: "pointer",
              fontSize: "12px",
            }}
          >
            👁
          </span>
        </div>

        <button
          type="submit"
          style={{
            padding: "10px 14px",
            borderRadius: "8px",
            border: "none",
            background: "#111827",
            color: "#fff",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: 500,
            width: "fit-content",
          }}
        >
          Change Password
        </button>

        {message && (
          <p style={{ fontSize: "13px", color: "#374151" }}>{message}</p>
        )}
      </form>
    </div>
  );
}