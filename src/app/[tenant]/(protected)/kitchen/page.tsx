export const revalidate = 10;
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
        in: ["PENDING", "CONFIRMED"],
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

  return (
    <div>
      <h1 style={{ margin: "0 0 20px", fontSize: "28px", color: "#111827" }}>
        Kitchen Board
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
          gap: "14px",
        }}
      >
        <Column title="Pending" orders={pending} tenant={tenant} />
        <Column title="Confirmed" orders={confirmed} tenant={tenant} />
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
      <h2 style={{ margin: "0 0 10px", fontSize: "18px" }}>{title}</h2>

      {orders.map((order: any) => (
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

          <div style={{ marginTop: "8px" }}>
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
                  <button>Accept</button>
                </form>

                <form action={updateKitchenOrderStatus.bind(null, tenant, order.id, "CANCELLED")}>
                  <button>Decline</button>
                </form>
              </>
            )}

            {order.status === "CONFIRMED" && (
              <form action={updateKitchenOrderStatus.bind(null, tenant, order.id, "COMPLETED")}>
                <button>Mark Complete</button>
              </form>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}