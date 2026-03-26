export const revalidate = 5;
import { requireAuth } from "@/lib/require-auth";
import { db } from "@/lib/db";
import { updateKitchenOrderStatus } from "./actions";

interface Props {
  params: Promise<{ tenant: string }>;
}

export default async function KitchenPage({ params }: Props) {
  const { tenant } = await params;

  const session = await requireAuth(tenant);

  const orders = await db.order.findMany({
    where: {
      tenantId: session.user.tenantId,
      restaurantId: session.user.restaurantId,
      status: {
        in: ["PENDING", "CONFIRMED", "IN_PROGRESS", "READY"],
      },
    },
    include: {
      items: true,
    },
    orderBy: {
      placedAt: "asc",
    },
  });

  const pending = orders.filter((o) => o.status === "PENDING");
  const confirmed = orders.filter((o) => o.status === "CONFIRMED");
  const inProgress = orders.filter((o) => o.status === "IN_PROGRESS");
  const ready = orders.filter((o) => o.status === "READY");

  return (
    <div>
      <h1 style={{ margin: "0 0 20px", fontSize: "28px", color: "#111827" }}>Kitchen Board</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
          gap: "14px",
        }}
      >
        <Column title="Pending" orders={pending} tenant={tenant} />
        <Column title="Confirmed" orders={confirmed} tenant={tenant} />
        <Column title="Cooking" orders={inProgress} tenant={tenant} />
        <Column title="Ready" orders={ready} tenant={tenant} />
      </div>
    </div>
  );
}

function Column({ title, orders, tenant }: any) {
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
      <h2 style={{ margin: "0 0 10px", fontSize: "18px", color: "#111827" }}>{title}</h2>

      {orders.length === 0 && (
        <p style={{ color: "#6b7280", margin: 0 }}>No orders</p>
      )}

      {orders.map((order: any) => (
        <div
          key={order.id}
          style={{
            border: "1px solid #e5e7eb",
            padding: "12px",
            borderRadius: "8px",
            marginBottom: "10px",
            background: "white",
          }}
        >
          <strong style={{ color: "#111827" }}>#{order.orderCode}</strong>

          {order.tableNumber && (
            <p style={{ margin: "6px 0 0", fontSize: "14px", color: "#4b5563" }}>Table {order.tableNumber}</p>
          )}

          <div style={{ marginTop: "8px", display: "grid", gap: "4px" }}>
          {order.items.map((item: any) => (
            <div key={item.id} style={{ fontSize: "14px", color: "#374151" }}>
              {item.quantity}x {item.name}

              {item.isJain && (
                <span
                  style={{
                    background: "#16a34a",
                    color: "white",
                    padding: "2px 6px",
                    borderRadius: "6px",
                    fontSize: "11px",
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
          </div>
          {order.notes && (
            <div
              style={{
                marginTop: "8px",
                background: "#fef9c3",
                padding: "6px",
                borderRadius: "6px",
                fontSize: "13px",
              }}
            >
              <strong>Order Note:</strong> {order.notes}
            </div>
          )}
          <div style={{ marginTop: "10px", display: "flex", gap: "6px", flexWrap: "wrap" }}>

          {order.status === "PENDING" && (
          <>
            <form action={updateKitchenOrderStatus.bind(null, tenant, order.id, "CONFIRMED")}>
              <button type="submit" style={{
              padding: "8px 12px",
              background: "#111827",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "13px",
            }}>Accept</button>
            </form>

            <form action={updateKitchenOrderStatus.bind(null, tenant, order.id, "CANCELLED")}>
              <button type="submit" style={{
              padding: "8px 12px",
              background: "#fff",
              color: "#111827",
              border: "1px solid #d1d5db",
              borderRadius: "8px",
              fontSize: "13px",
              cursor: "pointer",
            }}>Decline</button>
            </form>
          </>
        )}

        {order.status === "CONFIRMED" && (
          <>
            <form action={updateKitchenOrderStatus.bind(null, tenant, order.id, "IN_PROGRESS")}>
              <button type="submit" style={{
              padding: "8px 12px",
              background: "#111827",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "13px",
            }}>Start Cooking</button>
            </form>

            <form action={updateKitchenOrderStatus.bind(null, tenant, order.id, "CANCELLED")}>
              <button type="submit" style={{
              padding: "8px 12px",
              background: "#fff",
              color: "#111827",
              border: "1px solid #d1d5db",
              borderRadius: "8px",
              fontSize: "13px",
              cursor: "pointer",
            }}>Cancel</button>
            </form>
          </>
        )}

        {order.status === "IN_PROGRESS" && (
          <>
            <form action={updateKitchenOrderStatus.bind(null, tenant, order.id, "READY")}>
              <button type="submit" style={{
              padding: "8px 12px",
              background: "#111827",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "13px",
            }}>Mark Ready</button>
            </form>

            <form action={updateKitchenOrderStatus.bind(null, tenant, order.id, "CANCELLED")}>
              <button type="submit" style={{
              padding: "8px 12px",
              background: "#fff",
              color: "#111827",
              border: "1px solid #d1d5db",
              borderRadius: "8px",
              fontSize: "13px",
              cursor: "pointer",
            }}>Cancel</button>
            </form>
          </>
        )}

        {order.status === "READY" && (
          <form action={updateKitchenOrderStatus.bind(null, tenant, order.id, "COMPLETED")}>
            <button type="submit" style={{
              padding: "8px 12px",
              background: "#111827",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "13px",
            }}>Complete</button>
          </form>
        )}

      </div>
        </div>
      ))}
    </div>
  );
}