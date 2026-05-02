"use client";

import { useEffect, useState } from "react";
import WeeklyChart from "@/components/WeeklyChart";

export default function WeeklyAnalytics({ tenantId, restaurantId }: any) {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch(`/api/analytics/weekly?tenantId=${tenantId}&restaurantId=${restaurantId}`)
      .then((res) => res.json())
      .then(setData);
  }, [tenantId, restaurantId]);

  if (!data) {
    return <p style={{ marginTop: "20px" }}>Loading analytics...</p>;
  }

  return (
    <div style={{ marginTop: "30px", display: "grid", gap: "25px" }}>
      <div
        style={{
          background: "white",
          border: "1px solid #e5e7eb",
          borderRadius: "12px",
          padding: "20px",
        }}
      >
        <h3 style={{ marginBottom: "10px" }}>Orders This Week</h3>
        <WeeklyChart data={data} type="orders" />
      </div>

      <div
        style={{
          background: "white",
          border: "1px solid #e5e7eb",
          borderRadius: "12px",
          padding: "20px",
        }}
      >
        <h3 style={{ marginBottom: "10px" }}>Revenue This Week</h3>
        <WeeklyChart data={data} type="revenue" />
      </div>
    </div>
  );
}