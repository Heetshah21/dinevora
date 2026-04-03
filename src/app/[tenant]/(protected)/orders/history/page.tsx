export const revalidate = 10;

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
      OR: [
        {
          payments: {
            some: {
              status: "CAPTURED",
            },
          },
        },
        {
          status: "CANCELLED",
        },
      ],
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

      <div className="servoraStackMobile" style={{ display: "grid", gap: "15px" }}>
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
            <strong>#{order.orderCode}</strong>

            <div style={{ marginTop: "6px" }}>
              {order.tableNumber ? (
                <p style={{ margin: 0, fontSize: "13px", color: "#6b7280" }}>
                  Table {order.tableNumber}
                </p>
              ) : order.source === "TAKEAWAY" ? (
                <>
                  <p style={{ margin: 0, fontSize: "13px", color: "#6b7280" }}>
                    Takeaway – {order.customerName || ""}
                  </p>
                  <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#6b7280" }}>
                    Phone: {order.customerPhone || ""}
                  </p>
                </>
              ) : order.source === "DELIVERY" ? (
                <>
                  <p style={{ margin: 0, fontSize: "13px", color: "#6b7280" }}>
                    Delivery – {order.customerName || ""}
                  </p>
                  <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#6b7280" }}>
                    Phone: {order.customerPhone || ""}
                  </p>
                  <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#6b7280" }}>
                    Address: {order.deliveryAddress || ""}
                  </p>
                </>
              ) : null}
            </div>

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