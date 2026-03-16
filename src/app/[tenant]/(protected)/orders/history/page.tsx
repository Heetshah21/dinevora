export const revalidate = 5;

import { requireAuth } from "@/lib/require-auth";
import { db } from "@/lib/db";

interface Props {
  params: Promise<{ tenant: string }>;
}

export default async function OrderHistoryPage({ params }: Props) {
  const { tenant } = await params;

  const session = await requireAuth(tenant);

  const orders = await db.order.findMany({
    where: {
      tenantId: session.user.tenantId,
      restaurantId: session.user.restaurantId,
      status: {
        in: ["COMPLETED", "CANCELLED"],
      },
    },
    include: {
      items: true,
    },
    orderBy: {
      placedAt: "desc",
    },
  });

  return (
    <div>
      <h1 style={{ marginBottom: "30px" }}>Order History</h1>

      {orders.length === 0 && (
        <p style={{ color: "#777" }}>No past orders</p>
      )}

      <div style={{ display: "grid", gap: "15px" }}>
        {orders.map((order: any) => (
          <div
            key={order.id}
            style={{
              border: "1px solid #ddd",
              padding: "15px",
              borderRadius: "10px",
              background: "white",
            }}
          >
            <strong>#{order.id.slice(0, 6)}</strong>

            {order.tableNumber && (
              <p>Table {order.tableNumber}</p>
            )}

            <p>Status: {order.status}</p>

            <div style={{ marginTop: "8px" }}>
              {order.items.map((item: any) => (
                <div key={item.id}>
                  {item.quantity}x {item.name}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}