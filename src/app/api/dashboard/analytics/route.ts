import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const tenantId = searchParams.get("tenantId");
  const restaurantId = searchParams.get("restaurantId");
  const range = searchParams.get("range") || "today";

  if (!tenantId || !restaurantId) {
    return NextResponse.json({ error: "Missing params" });
  }

  const now = new Date();

  let startDate = new Date();

  if (range === "yesterday") {
    startDate.setDate(now.getDate() - 1);
    startDate.setHours(0, 0, 0, 0);

    now.setDate(now.getDate() - 1);
    now.setHours(23, 59, 59, 999);
  } else if (range === "7d") {
    startDate.setDate(now.getDate() - 6);
    startDate.setHours(0, 0, 0, 0);
  } else if (range === "30d") {
    startDate.setDate(now.getDate() - 29);
    startDate.setHours(0, 0, 0, 0);
  } else {
    startDate.setHours(0, 0, 0, 0);
  }

  const [orders, payments] = await Promise.all([
    db.order.findMany({
      where: {
        tenantId,
        restaurantId,
        placedAt: {
          gte: startDate,
          lte: now,
        },
      },
      select: {
        status: true,
      },
    }),

    db.payment.aggregate({
      where: {
        tenantId,
        order: {
          restaurantId,
        },
        status: "CAPTURED",
        paidAt: {
          gte: startDate,
          lte: now,
        },
      },
      _sum: {
        amount: true,
      },
    }),
  ]);

  const totalOrders = orders.length;

  const completedOrders = orders.filter(
    (o) =>
      o.status === "COMPLETED" ||
      o.status === "PAID"
  ).length;

  const revenue =
    Number(payments._sum.amount ?? 0);

  const avgOrderValue =
    completedOrders > 0
      ? Math.round(revenue / completedOrders)
      : 0;

  return NextResponse.json({
    totalOrders,
    completedOrders,
    revenue,
    avgOrderValue,
  });
}