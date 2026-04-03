"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ActionButton({
  action,
  tenant,
  orderId,
  status,
  amount,
  style,
  children,
}: any) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  return (
    <button
      type="button"
      onClick={async () => {
        if (loading) return;
        setLoading(true);

        const formData = new FormData();
        if (orderId) formData.append("orderId", orderId);
        if (status) formData.append("status", status);
        if (amount) formData.append("amount", amount);

        await action(tenant, formData);
        router.refresh();
        setLoading(false);
      }}
      style={{
        opacity: loading ? 0.6 : 1,
        cursor: loading ? "not-allowed" : "pointer",
        ...style,
      }}
    >
      {loading ? "Loading..." : children}
    </button>
  );
}