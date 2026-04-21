"use client";

import { useEffect, useState } from "react";

type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "IN_PROGRESS"
  | "READY"
  | "COMPLETED"
  | "CANCELLED";

type OrderItem = {
  id: string;
  name: string;
  quantity: number;
  isJain?: boolean;
  notes?: string | null;
};

type Order = {
  id: string;
  orderCode: string;
  status: OrderStatus;
  total: number;

  source?: "IN_STORE" | "TAKEAWAY" | "DELIVERY"; // ✅ NEW
  tableNumber?: string | null;                  // ✅ NEW
  customerName?: string | null;                 // ✅ NEW
  notes?: string | null;

  items: OrderItem[];
};

interface Props {
  initialOrders: Order[];
  tenantId: string;
  restaurantId: string;
}

export default function OrdersClient({
  initialOrders,
  tenantId,
  restaurantId,
}: Props) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [loadingIds, setLoadingIds] = useState<string[]>([]);

  // 🔁 Polling
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(
          `/api/orders/list?tenantId=${tenantId}&restaurantId=${restaurantId}&type=orders`
        );
        const data: Order[] = await res.json();

        setOrders((prev) =>
          data.map((newOrder) => {
            const existing = prev.find((o) => o.id === newOrder.id);

            if (existing && existing.status !== newOrder.status) {
              return existing;
            }

            return newOrder;
          })
        );
      } catch (e) {
        console.error("Polling failed", e);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [tenantId, restaurantId]);

  // ⚡ Update status
  const updateStatus = async (orderId: string, status: OrderStatus) => {
    setLoadingIds((prev) => [...prev, orderId]);

    let previous: Order[] = [];

    setOrders((prev) => {
      previous = prev;
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
    } catch {
      setOrders(previous);
      alert("Failed to update order");
    } finally {
      setLoadingIds((prev) => prev.filter((id) => id !== orderId));
    }
  };

  // 💰 Mark Paid
  const markPaid = async (order: Order) => {
    setLoadingIds((prev) => [...prev, order.id]);

    try {
      const res = await fetch("/api/orders/pay", {
        method: "POST",
        body: JSON.stringify({
          orderId: order.id,
          amount: order.total,
          tenantId,
        }),
      });

      const data = await res.json();
      if (!data.success) throw new Error();
    } catch {
      alert("Payment failed");
    } finally {
      setLoadingIds((prev) => prev.filter((id) => id !== order.id));
    }
  };

  return (
    <div>
      {orders.length === 0 && (
        <p style={{ color: "#6b7280" }}>No orders yet</p>
      )}

      {orders.map((order) => (
        <div
          key={order.id}
          style={{
            border: "1px solid #e5e7eb",
            padding: "16px",
            borderRadius: "10px",
            marginBottom: "14px",
            background: "#fff",
          }}
        >
          <strong>Order #{order.orderCode}</strong>

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

          <p>Status: {order.status}</p>

          {/* 🔸 Notes */}
          {order.notes && (
            <p style={{ fontStyle: "italic", color: "#374151" }}>
              Note: {order.notes}
            </p>
          )}

          {/* 🔸 Items */}
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

          {/* 🔸 Actions */}
          <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
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

            {order.status === "COMPLETED" && (
              <button
                disabled={loadingIds.includes(order.id)}
                onClick={() => markPaid(order)}
                style={btnSuccess}
              >
                Mark Paid
              </button>
            )}
          </div>

          <p style={{ marginTop: 10, fontWeight: 600 }}>
            Total: ₹{order.total}
          </p>
        </div>
      ))}
    </div>
  );
}

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