"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ActionButton({ action, children, style }: any) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  return (
    <form
      action={async () => {
        if (loading) return;
        setLoading(true);
        await action();
        router.refresh();
        setLoading(false);
      }}
    >
      <button
        type="submit"
        style={{
          opacity: loading ? 0.6 : 1,
          cursor: loading ? "not-allowed" : "pointer",
          ...style,
        }}
      >
        {loading ? "Loading..." : children}
      </button>
    </form>
  );
}