import { requireAuth } from "@/lib/require-auth";
import { db } from "@/lib/db";
import { createTestOrder } from "./actions";
import { updateOrderStatus } from "./actions";

interface Props {
  params: Promise<{ tenant: string }>;
}

export default async function OrdersPage({ params }: Props) {
  const { tenant } = await params;

  const session = await requireAuth(tenant);

  const orders = await db.order.findMany({
    where: {
      tenantId: session.user.tenantId,
      restaurantId: session.user.restaurantId,
      status: {
        notIn: ["COMPLETED", "CANCELLED"],
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
      <h1 style={{ marginBottom: "30px" }}>Orders</h1>
      <form
        action={async () => {
          "use server";
          await createTestOrder(tenant);
        }}
        style={{ marginBottom: "20px" }}
      >
        <button
          type="submit"
          style={{
            padding: "8px 14px",
            background: "black",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Create Test Order
        </button>
      </form>
      {orders.length === 0 && <p>No orders yet.</p>}

      {orders.map((order) => (
        <div
          key={order.id}
          style={{
            border: "1px solid #ddd",
            padding: "15px",
            borderRadius: "8px",
            marginBottom: "20px",
          }}
        >
          <strong>Order #{order.orderCode || order.id.slice(0, 6)}</strong>

          {order.tableNumber && (
            <p>Table: {order.tableNumber}</p>
          )}

          <p>Status: {order.status}</p>

          <div style={{ marginTop: "10px" }}>
            {order.items.map((item) => (
              <div key={item.id}>
                {item.quantity}x {item.name}
              </div>
            ))}
          </div>
          <form
          action={async (formData: FormData) => {
            "use server";
            await updateOrderStatus(tenant, formData);
          }}
          style={{ marginTop: "10px" }}
        >
          <input type="hidden" name="orderId" value={order.id} />

          {order.status === "PENDING" && (
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              name="status"
              value="CONFIRMED"
              style={{
                padding: "6px 12px",
                background: "#2e7d32",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              Accept
            </button>

            <button
              name="status"
              value="CANCELLED"
              style={{
                padding: "6px 12px",
                background: "#c62828",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              Decline
            </button>
          </div>
        )}

          

          {order.status === "READY" && (
            <button name="status" value="COMPLETED" style={{
              padding: "6px 12px",
              background: "#2e7d32",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}>
              Complete Order
            </button>
          )}
          {order.status === "CANCELLED" && (
          <span
            style={{
              padding: "4px 10px",
              background: "#b71c1c",
              color: "white",
              borderRadius: "6px",
              fontSize: "12px",
            }}
          >
            Order Cancelled
          </span>
        )}
        </form>
          <p style={{ marginTop: "10px" }}>
            Total: ₹{order.total.toString()}
          </p>
        </div>
      ))}
    </div>
    
  );
}