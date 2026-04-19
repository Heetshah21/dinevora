"use client";

import { useEffect, useState } from "react";

type OrderItem = {
  id: string;
  name: string;
  quantity: number;
};

type Order = {
  id: string;
  orderCode: string;
  status: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
  placedAt: string;
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

  // 🔁 Polling
  useEffect(() => {
    const interval = setInterval(async () => {
      const res = await fetch(
        `/api/orders/list?tenantId=${tenantId}&restaurantId=${restaurantId}`
      );
      const data = await res.json();
      setOrders(data);
    }, 3000);

    return () => clearInterval(interval);
  }, [tenantId, restaurantId]);

  // ⚡ Optimistic update
  const updateStatus = async (
    orderId: string,
    status: Order["status"]
  ) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId ? { ...o, status } : o
      )
    );

    await fetch("/api/orders/update", {
      method: "POST",
      body: JSON.stringify({ orderId, status }),
    });
  };

  const pending = orders.filter((o) => o.status === "PENDING");
  const confirmed = orders.filter((o) => o.status === "CONFIRMED");

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
      <Column title="Pending" orders={pending} updateStatus={updateStatus} />
      <Column title="Confirmed" orders={confirmed} updateStatus={updateStatus} />
    </div>
  );
}

function Column({
  title,
  orders,
  updateStatus,
}: {
  title: string;
  orders: Order[];
  updateStatus: (id: string, status: Order["status"]) => void;
}) {
  return (
    <div style={{ border: "1px solid #e5e7eb", padding: 12 }}>
      <h2>{title}</h2>

      {orders.map((order) => (
        <div key={order.id} style={{ marginBottom: 10 }}>
          <strong>#{order.orderCode}</strong>

          {order.items.map((item) => (
            <div key={item.id}>
              {item.quantity}x {item.name}
            </div>
          ))}

          <div style={{ marginTop: 10 }}>
            {order.status === "PENDING" && (
              <>
                <button onClick={() => updateStatus(order.id, "CONFIRMED")}>
                  Accept
                </button>
                <button onClick={() => updateStatus(order.id, "CANCELLED")}>
                  Decline
                </button>
              </>
            )}

            {order.status === "CONFIRMED" && (
              <button onClick={() => updateStatus(order.id, "COMPLETED")}>
                Ready
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}