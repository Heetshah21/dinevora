export const revalidate = 10;

import { requireAuth } from "@/lib/require-auth";
import { db } from "@/lib/db";
import AnalyticsModal from "@/components/AnalyticsModal";
import WeeklyAnalytics from "@/components/WeeklyAnalytics";

interface Props {
  params: Promise<{ tenant: string }>;
}

export default async function DashboardPage({ params }: Props) {
  const { tenant } = await params;

  const session = await requireAuth(tenant);

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const restaurant = await db.restaurant.findFirst({
    where: {
      id: session.user.restaurantId,
    },
  });

  const [
    orders,
    activeOrders,
    menuItems,
    revenueToday
  ] = await Promise.all([
    db.order.findMany({
      where: {
        tenantId: session.user.tenantId,
        restaurantId: session.user.restaurantId,
        placedAt: { gte: startOfDay },
      },
      select: {
        status: true,
        source: true,
        total: true,
      },
    }),

    db.order.count({
      where: {
        tenantId: session.user.tenantId,
        restaurantId: session.user.restaurantId,
        status: {
          in: ["PENDING", "CONFIRMED", "IN_PROGRESS", "READY"],
        },
      },
    }),

    db.menuItem.count({
      where: {
        tenantId: session.user.tenantId,
        restaurantId: session.user.restaurantId,
      },
    }),

    db.payment.aggregate({
      where: {
        tenantId: session.user.tenantId,
        order: {
          restaurantId: session.user.restaurantId,
        },
        status: "CAPTURED",
        paidAt: { gte: startOfDay },
      },
      _sum: { amount: true },
    }),
  ]);

  // Calculate analytics from orders array
  const ordersToday = orders.length;

  const completedOrdersToday = orders.filter(
    (o) => o.status === "PAID"
  ).length;

  const dineInOrders = orders.filter(
    (o) => o.source === "IN_STORE"
  ).length;

  const takeawayOrders = orders.filter(
    (o) => o.source === "TAKEAWAY"
  ).length;

  const deliveryOrders = orders.filter(
    (o) => o.source === "DELIVERY"
  ).length;

  const revenue = revenueToday._sum.amount?.toString() ?? "0";

  const avgOrderValue =
    completedOrdersToday > 0
      ? (Number(revenue) / completedOrdersToday).toFixed(0)
      : "0";

  return (
    <div>
      <h1 style={{ margin: "0 0 20px", fontSize: "28px", color: "#111827" }}>
        Dashboard
      </h1>
      <AnalyticsModal
        tenantId={session.user.tenantId}
        restaurantId={session.user.restaurantId}
      />

      <div
        className="servoraStackMobile"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
          gap: "15px",
          alignItems: "stretch",
        }}
      >
        <Card title="Orders Today" value={ordersToday} />
        <Card title="Active Orders" value={activeOrders} />
        <Card title="Menu Items" value={menuItems} />
        <Card title="Revenue Today" value={revenue} />
        <Card title="Completed Orders" value={completedOrdersToday} />
        <Card title="Avg Order Value" value={`₹${avgOrderValue}`} />

        {restaurant?.acceptsDineIn && (
          <Card title="Dine-In Orders" value={dineInOrders} />
        )}

        {restaurant?.acceptsTakeaway && (
          <Card title="Takeaway Orders" value={takeawayOrders} />
        )}

        {restaurant?.acceptsDelivery && (
          <Card title="Delivery Orders" value={deliveryOrders} />
        )}
      </div>
    <WeeklyAnalytics
    tenantId={session.user.tenantId}
    restaurantId={session.user.restaurantId}
  />
  </div>
  );
}

function Card({ title, value }: any) {
  return (
    <div
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: "11px",
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