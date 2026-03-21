"use client";

import { signIn } from "next-auth/react";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const params = useParams();
  const tenant = params.tenant as string;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const res = await signIn("credentials", {
      email,
      password,
      tenantSlug: tenant,
      redirect: false,
      callbackUrl: `/${tenant}/dashboard`,
    });
    
    if (res?.ok) {
      window.location.href = `/${tenant}/dashboard`;
    }
  };

    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "#f5f5f5",
        }}
      >
        <div
          style={{
            width: "360px",
            background: "white",
            padding: "30px",
            borderRadius: "10px",
            border: "1px solid #e5e5e5",
          }}
        >
          <h2 style={{ marginBottom: "5px" }}>Servora</h2>
          <p style={{ marginBottom: "20px", color: "#555" }}>
            Login to {tenant}
          </p>
  
          <form>
            <div style={{ marginBottom: "15px" }}>
              <label>Email</label>
              <br />
              <input
                name="email"
                style={{
                  width: "100%",
                  padding: "8px",
                  marginTop: "5px",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                }}
              />
            </div>
  
            <div style={{ marginBottom: "20px" }}>
              <label>Password</label>
              <br />
              <input
                name="password"
                type="password"
                style={{
                  width: "100%",
                  padding: "8px",
                  marginTop: "5px",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                }}
              />
            </div>
  
            <button
              type="submit"
              style={{
                width: "100%",
                padding: "10px",
                background: "#111",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }
