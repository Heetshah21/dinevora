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
    <div style={{ padding: 40 }}>
      <h1>Login to {tenant}</h1>

      <input
        placeholder="email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <br /><br />

      <input
        type="password"
        placeholder="password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <br /><br />

      <button onClick={handleLogin}>
        Login
      </button>
    </div>
  );
}
