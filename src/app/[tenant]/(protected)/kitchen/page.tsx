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
      <h1 style={{ marginBottom: "30px" }}>Kitchen Board</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "20px",
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
    <div>
      <h2 style={{ marginBottom: "10px" }}>{title}</h2>

      {orders.length === 0 && (
        <p style={{ color: "#777" }}>No orders</p>
      )}

      {orders.map((order: any) => (
        <div
          key={order.id}
          style={{
            border: "1px solid #ddd",
            padding: "10px",
            borderRadius: "8px",
            marginBottom: "10px",
            background: "white",
          }}
        >
          <strong>#{order.id.slice(0, 6)}</strong>

          {order.tableNumber && (
            <p>Table {order.tableNumber}</p>
          )}

          <div style={{ marginTop: "5px" }}>
            {order.items.map((item: any) => (
              <div key={item.id}>
                {item.quantity}x {item.name}
              </div>
            ))}
          </div>
          <div style={{ marginTop: "10px", display: "flex", gap: "6px" }}>

          {order.status === "PENDING" && (
          <>
            <form action={updateKitchenOrderStatus.bind(null, tenant, order.id, "CONFIRMED")}>
              <button type="submit" style={{
              padding: "6px 12px",
              background: "#2e7d32",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}>Accept</button>
            </form>

            <form action={updateKitchenOrderStatus.bind(null, tenant, order.id, "CANCELLED")}>
              <button type="submit" style={{
              padding: "4px 10px",
              background: "#b71c1c",
              color: "white",
              borderRadius: "6px",
              fontSize: "12px",
            }}>Decline</button>
            </form>
          </>
        )}

        {order.status === "CONFIRMED" && (
          <>
            <form action={updateKitchenOrderStatus.bind(null, tenant, order.id, "IN_PROGRESS")}>
              <button type="submit" style={{
              padding: "6px 12px",
              background: "#2e7d32",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}>Start Cooking</button>
            </form>

            <form action={updateKitchenOrderStatus.bind(null, tenant, order.id, "CANCELLED")}>
              <button type="submit" style={{
              padding: "4px 10px",
              background: "#b71c1c",
              color: "white",
              borderRadius: "6px",
              fontSize: "12px",
            }}>Cancel</button>
            </form>
          </>
        )}

        {order.status === "IN_PROGRESS" && (
          <>
            <form action={updateKitchenOrderStatus.bind(null, tenant, order.id, "READY")}>
              <button type="submit" style={{
              padding: "6px 12px",
              background: "#2e7d32",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}>Mark Ready</button>
            </form>

            <form action={updateKitchenOrderStatus.bind(null, tenant, order.id, "CANCELLED")}>
              <button type="submit" style={{
              padding: "4px 10px",
              background: "#b71c1c",
              color: "white",
              borderRadius: "6px",
              fontSize: "12px",
            }}>Cancel</button>
            </form>
          </>
        )}

        {order.status === "READY" && (
          <form action={updateKitchenOrderStatus.bind(null, tenant, order.id, "COMPLETED")}>
            <button type="submit" style={{
              padding: "6px 12px",
              background: "#2e7d32",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}>Complete</button>
          </form>
        )}

      </div>
        </div>
      ))}
    </div>
  );
}