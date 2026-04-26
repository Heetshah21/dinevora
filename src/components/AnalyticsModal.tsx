"use client";

import { useState } from "react";

export default function AnalyticsModal({
  tenantId,
  restaurantId,
}: {
  tenantId: string;
  restaurantId: string;
}) {
  const [open, setOpen] = useState(false);
  const [range, setRange] = useState("today");
  const [loading, setLoading] = useState(false);

  const [data, setData] = useState<any>(null);

  const loadData = async (selectedRange: string) => {
    setLoading(true);

    try {
      const res = await fetch(
        `/api/dashboard/analytics?tenantId=${tenantId}&restaurantId=${restaurantId}&range=${selectedRange}`,
        { cache: "no-store" }
      );

      const json = await res.json();

      setData(json);
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  const openModal = async () => {
    setOpen(true);

    if (!data) {
      await loadData(range);
    }
  };

  const changeRange = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const val = e.target.value;

    setRange(val);

    await loadData(val);
  };

  return (
    <>
      <button
        onClick={openModal}
        style={{
          padding: "10px 14px",
          background: "#111827",
          color: "white",
          border: "none",
          borderRadius: "10px",
          cursor: "pointer",
          marginBottom: "18px",
          fontWeight: 600,
        }}
      >
        View Analytics
      </button>

      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.35)",
            backdropFilter: "blur(6px)",
            zIndex: 999,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "16px",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%",
              maxWidth: "420px",
              background: "white",
              borderRadius: "16px",
              padding: "22px",
              boxShadow: "0 12px 30px rgba(0,0,0,0.12)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "18px",
              }}
            >
              <h2
                style={{
                  margin: 0,
                  fontSize: "22px",
                  color: "#111827",
                }}
              >
                Analytics
              </h2>

              <button
                onClick={() => setOpen(false)}
                style={{
                  border: "none",
                  background: "transparent",
                  fontSize: "22px",
                  cursor: "pointer",
                }}
              >
                ×
              </button>
            </div>

            <select
              value={range}
              onChange={changeRange}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "10px",
                border: "1px solid #e5e7eb",
                marginBottom: "18px",
              }}
            >
              <option value="today">Today</option>
              <option value="yesterday">Yesterday</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
            </select>

            {loading ? (
              <p>Loading...</p>
            ) : data ? (
              <div style={{ display: "grid", gap: "12px" }}>
                <Card
                  title="Total Orders"
                  value={data.totalOrders}
                />

                <Card
                  title="Completed Orders"
                  value={data.completedOrders}
                />

                <Card
                  title="Revenue"
                  value={`₹${data.revenue}`}
                />

                <Card
                  title="Avg Order Value"
                  value={`₹${data.avgOrderValue}`}
                />
              </div>
            ) : null}
          </div>
        </div>
      )}
    </>
  );
}

function Card({
  title,
  value,
}: {
  title: string;
  value: string | number;
}) {
  return (
    <div
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: "12px",
        padding: "14px",
      }}
    >
      <p
        style={{
          margin: "0 0 6px",
          color: "#6b7280",
          fontSize: "13px",
        }}
      >
        {title}
      </p>

      <h3
        style={{
          margin: 0,
          fontSize: "24px",
          color: "#111827",
        }}
      >
        {value}
      </h3>
    </div>
  );
}