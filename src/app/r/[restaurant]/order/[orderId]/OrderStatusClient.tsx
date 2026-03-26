"use client";

import { useEffect, useState } from "react";

export default function OrderStatusClient({ orderId }: any) {
  const [order, setOrder] = useState<any>(null);

  const loadOrder = async () => {
    const res = await fetch(`/api/orders/${orderId}`);
    const data = await res.json();
    setOrder(data);
  };

  useEffect(() => {
    loadOrder();

    const interval = setInterval(loadOrder, 5000); // refresh every 5 sec

    return () => clearInterval(interval);
  }, []);

  if (!order) return <p>Loading...</p>;

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h1>Order Status</h1>

      <p>Status: {order.status}</p>

      <h3>Items</h3>

      {order.items.map((item: any) => (
        <div key={item.id} style={{ marginBottom: "10px" }}>
          {item.name}
          {item.isJain && (
            <span style={{ color: "green" }}> (Jain)</span>
          )}
          {" "}x {item.quantity}

          {item.notes && (
            <div style={{ fontSize: "12px", color: "#666" }}>
              Note: {item.notes}
            </div>
          )}
        </div>
      ))}
      {order.notes && (
        <div style={{ marginTop: "15px" }}>
          <strong>Special Instructions:</strong>
          <p>{order.notes}</p>
        </div>
      )}

      <h2>Total: ₹{order.total}</h2>
    </div>
  );
}