import { requireAuth } from "@/lib/require-auth";
import { db } from "@/lib/db";
import { createTestOrder } from "./actions";
import { updateOrderStatus } from "./actions";
import { markOrderPaid } from "./actions";

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
      payments: {
        none: {
          status: "CAPTURED",
        },
      },
      status: {
        not: "CANCELLED",
      },
    },
    include: {
      items: true,
      payments: true,
    },
    orderBy: {
      placedAt: "desc",
    },
  });

  return (
    <div>
      <h1 style={{ margin: "0 0 20px", fontSize: "28px", color: "#111827" }}>Orders</h1>
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
            padding: "10px 14px",
            background: "#111827",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: 500,
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
            border: "1px solid #e5e7eb",
            padding: "16px",
            borderRadius: "10px",
            marginBottom: "14px",
            background: "#fff",
          }}
        >
          <strong style={{ color: "#111827" }}>Order #{order.orderCode}</strong>

          <div style={{ marginTop: "8px" }}>
            {order.tableNumber ? (
              <p style={{ margin: 0, fontSize: "13px", color: "#6b7280" }}>
                Table {order.tableNumber}
              </p>
            ) : order.source === "ONLINE" ? (
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

          <p style={{ margin: "6px 0 0", color: "#4b5563", fontSize: "14px" }}>Status: {order.status}</p>

          <div style={{ marginTop: "10px", display: "grid", gap: "4px" }}>
          {order.items.map((item) => (
            <div key={item.id} style={{ color: "#374151", fontSize: "14px" }}>
              {item.quantity}x {item.name}
              {item.isJain && (
                  <span
                  style={{
                    background: "#16a34a",
                    color: "white",
                    padding: "2px 6px",
                    borderRadius: "6px",
                    fontSize: "13px",
                    marginLeft: "6px",
                  }}
                >
                  Jain
                </span>
              )}

              {item.notes && (
                <div style={{ fontSize: "12px", color: "#6b7280" }}>
                  Note: {item.notes}
                </div>
              )}
            </div>
          ))}
        {order.notes && (
          <div style={{ marginTop: "8px" }}>
            <strong style={{ fontSize: "13px" }}>Order Note:</strong>
            <div style={{ fontSize: "13px", color: "#374151" }}>
              {order.notes}
            </div>
          </div>
        )}
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
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <button
              name="status"
              value="CONFIRMED"
              style={{
                padding: "8px 12px",
                background: "#111827",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "13px",
              }}
            >
              Accept
            </button>

            <button
              name="status"
              value="CANCELLED"
              style={{
                padding: "8px 12px",
                background: "#fff",
                color: "#111827",
                border: "1px solid #d1d5db",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "13px",
              }}
            >
              Decline
            </button>
          </div>
        )}

          

          {order.status === "READY" && (
            <button name="status" value="COMPLETED" style={{
              padding: "8px 12px",
              background: "#111827",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "13px",
            }}>
              Complete Order
            </button>
          )}
          </form>
          {order.status === "COMPLETED" && (
            <form
              action={async (formData: FormData) => {
                "use server";
                await markOrderPaid(tenant, formData);
              }}
              style={{ marginTop: "6px" }}
            >
              <input type="hidden" name="orderId" value={order.id} />
              <input type="hidden" name="amount" value={order.total.toString()} />

              <button
                style={{
                  padding: "8px 12px",
                  background: "#16a34a",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "13px",
                }}
              >
                Mark Paid
              </button>
            </form>
          )}

          <form>
          {order.status === "CANCELLED" && (
          <span
            style={{
              padding: "4px 10px",
              background: "#f3f4f6",
              color: "#374151",
              borderRadius: "6px",
              fontSize: "12px",
              border: "1px solid #e5e7eb",
            }}
          >
            Order Cancelled
          </span>
        )}
        </form>
          <p style={{ marginTop: "10px", fontWeight: 600, color: "#111827" }}>
            Total: ₹{order.total.toString()}
          </p>
        </div>
      ))}
    </div>
    
  );
}