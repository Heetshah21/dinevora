export const revalidate = 10;

import { requireAuth } from "@/lib/require-auth";
import { db } from "@/lib/db";

interface Props {
  params: Promise<{ tenant: string }>;
}

export default async function DashboardPage({ params }: Props) {
  const { tenant } = await params;

  const session = await requireAuth(tenant);

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const ordersToday = await db.order.count({
    where: {
      tenantId: session.user.tenantId,
      restaurantId: session.user.restaurantId,
      placedAt: {
        gte: startOfDay,
      },
    },
  });

  const activeOrders = await db.order.count({
    where: {
      tenantId: session.user.tenantId,
      restaurantId: session.user.restaurantId,
      status: {
        in: ["PENDING", "CONFIRMED", "IN_PROGRESS", "READY"],
      },
    },
  });

  const menuItems = await db.menuItem.count({
    where: {
      tenantId: session.user.tenantId,
      restaurantId: session.user.restaurantId,
    },
  });
  const revenueToday = await db.order.aggregate({
    where: {
      tenantId: session.user.tenantId,
      restaurantId: session.user.restaurantId,
      status: "COMPLETED",
      placedAt: {
        gte: startOfDay,
      },
    },
    _sum: {
      total: true,
    },
  });
  const revenue = revenueToday._sum.total?.toString() ?? "0";

  return (
    <div>
      <h1 style={{ marginBottom: "30px" }}>Dashboard</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "20px",
        }}
      >
        <Card title="Orders Today" value={ordersToday} />
        <Card title="Active Orders" value={activeOrders} />
        <Card title="Menu Items" value={menuItems} />
        <Card title="Revenue Today" value={revenue} />
      </div>
    </div>
  );
}

function Card({ title, value }: any) {
  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: "10px",
        padding: "24px",
        background: "white",
        textAlign: "center",
        minHeight: "110px"
      }}
    >
      <p
        style={{
          color: "#777",
          fontSize: "14px",
          marginBottom: "8px",
        }}
      >
        {title}
      </p>

      <h2
        style={{
          fontSize: "36px",
          fontWeight: "bold",
          margin: 0,
        }}
      >
        {value}
      </h2>
    </div>
  );
}