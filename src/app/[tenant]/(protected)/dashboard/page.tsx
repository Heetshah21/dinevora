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
      <h1 style={{ margin: "0 0 20px", fontSize: "28px", color: "#111827" }}>Dashboard</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
          gap: "16px",
          alignItems: "stretch",
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
        border: "1px solid #e5e7eb",
        borderRadius: "10px",
        padding: "20px",
        background: "white",
        minHeight: "110px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        boxSizing: "border-box",
      }}
    >
      <p
        style={{
          color: "#6b7280",
          fontSize: "13px",
          margin: "0 0 8px",
        }}
      >
        {title}
      </p>

      <h2
        style={{
          fontSize: "30px",
          fontWeight: 700,
          margin: 0,
          color: "#111827",
          lineHeight: 1.1,
        }}
      >
        {value}
      </h2>
    </div>
  );
}