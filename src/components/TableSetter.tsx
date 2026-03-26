"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function TableSetter() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const table = searchParams.get("table");
    if (table) {
      localStorage.setItem("servora_table", table);
    }
  }, [searchParams]);

  return null;
}