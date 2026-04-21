"use client";

import { useEffect, useState } from "react";

type OrderItem = {
  id: string;
  name: string;
  quantity: number;
  isJain?: boolean;
  notes?: string | null;
};

type OrderStatus = "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";

type Order = {
  id: string;
  orderCode: string;
  status: OrderStatus;
  placedAt: string;

  source?: "IN_STORE" | "TAKEAWAY" | "DELIVERY";
  tableNumber?: string | null;
  customerName?: string | null;
  notes?: string | null;

  items: OrderItem[];
};

interface Props {
  initialOrders: Order[];
  tenantId: string;
  restaurantId: string;
}

export default function KitchenClient({
  initialOrders,
  tenantId,
  restaurantId,
}: Props) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [loadingIds, setLoadingIds] = useState<string[]>([]);

  // 🔁 Polling with stale-data protection
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(
          `/api/orders/list?tenantId=${tenantId}&restaurantId=${restaurantId}&type=kitchen`
        );
        const data: Order[] = await res.json();

        setOrders((prev) =>
          data.map((newOrder) => {
            const existing = prev.find((o) => o.id === newOrder.id);

            // prevent flicker (keep optimistic state if ahead)
            if (existing && existing.status !== newOrder.status) {
              return existing;
            }

            return newOrder;
          })
        );
      } catch (err) {
        console.error("Polling failed:", err);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [tenantId, restaurantId]);

  // ⚡ Optimistic update
  const updateStatus = async (orderId: string, status: OrderStatus) => {
    setLoadingIds((prev) => [...prev, orderId]);

    let previousState: Order[] = [];

    setOrders((prev) => {
      previousState = prev;
      return prev.map((o) =>
        o.id === orderId ? { ...o, status } : o
      );
    });

    try {
      const res = await fetch("/api/orders/update", {
        method: "POST",
        body: JSON.stringify({ orderId, status }),
      });

      const data = await res.json();

      if (!data.success) throw new Error();
    } catch (err) {
      console.error(err);
      setOrders(previousState); // rollback
      alert("Failed to update order");
    } finally {
      setLoadingIds((prev) => prev.filter((id) => id !== orderId));
    }
  };

  const pending = orders.filter((o) => o.status === "PENDING");
  const confirmed = orders.filter((o) => o.status === "CONFIRMED");

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "14px",
      }}
    >
      <Column title="Pending" orders={pending} updateStatus={updateStatus} loadingIds={loadingIds} />
      <Column title="Confirmed" orders={confirmed} updateStatus={updateStatus} loadingIds={loadingIds} />
    </div>
  );
}

function Column({
  title,
  orders,
  updateStatus,
  loadingIds,
}: {
  title: string;
  orders: Order[];
  updateStatus: (id: string, status: OrderStatus) => void;
  loadingIds: string[];
}) {
  return (
    <div
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: "10px",
        background: "#fff",
        padding: "12px",
        minHeight: "220px",
      }}
    >
      <h2 style={{ margin: "0 0 10px", fontSize: "18px" }}>{title}</h2>

      {orders.map((order) => (
        <div
          key={order.id}
          style={{
            border: "1px solid #e5e7eb",
            padding: "12px",
            borderRadius: "8px",
            marginBottom: "10px",
          }}
        >
          <strong>#{order.orderCode}</strong>

          {/* 🔹 Order Type */}
          <div style={{ fontSize: "13px", color: "#6b7280", marginTop: "4px" }}>
            {order.source === "IN_STORE" && (
              <span>Table: {order.tableNumber || "-"}</span>
            )}
            {order.source === "TAKEAWAY" && (
              <span>Takeaway - {order.customerName || "Guest"}</span>
            )}
            {order.source === "DELIVERY" && (
              <span>Delivery - {order.customerName || "Customer"}</span>
            )}
          </div>

          {/* 🔹 Order Notes */}
          {order.notes && (
            <div style={{ fontSize: "12px", color: "#374151", marginTop: "4px" }}>
              Note: {order.notes}
            </div>
          )}

          {/* 🔹 Items */}
          <div style={{ marginTop: "8px" }}>
            {order.items.map((item) => (
              <div key={item.id}>
                {item.quantity}x {item.name}

                {item.isJain && (
                  <span style={{ marginLeft: 6, color: "#16a34a" }}>
                    (Jain)
                  </span>
                )}

                {item.notes && (
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#6b7280",
                      marginLeft: "6px",
                    }}
                  >
                    • {item.notes}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* 🔹 Actions */}
          <div style={{ marginTop: "10px", display: "flex", gap: "6px" }}>
            {order.status === "PENDING" && (
              <>
                <button
                  disabled={loadingIds.includes(order.id)}
                  onClick={() => updateStatus(order.id, "CONFIRMED")}
                  style={btnPrimary}
                >
                  Accept
                </button>

                <button
                  disabled={loadingIds.includes(order.id)}
                  onClick={() => updateStatus(order.id, "CANCELLED")}
                  style={btnSecondary}
                >
                  Decline
                </button>
              </>
            )}

            {order.status === "CONFIRMED" && (
              <button
                disabled={loadingIds.includes(order.id)}
                onClick={() => updateStatus(order.id, "COMPLETED")}
                style={btnSuccess}
              >
                Ready
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

// 🎨 Button styles
const btnPrimary = {
  padding: "8px 12px",
  background: "#111827",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
};

const btnSecondary = {
  padding: "8px 12px",
  background: "#fff",
  color: "#111827",
  border: "1px solid #d1d5db",
  borderRadius: "8px",
  cursor: "pointer",
};

const btnSuccess = {
  padding: "8px 12px",
  background: "#16a34a",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
};