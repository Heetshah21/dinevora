import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const tenantId = searchParams.get("tenantId");
  const restaurantId = searchParams.get("restaurantId");

  if (!tenantId || !restaurantId) {
    return NextResponse.json({ error: "Missing params" });
  }

  const now = new Date();

  // Get Monday of current week
  const day = now.getDay(); // 0 = Sun
  const diff = day === 0 ? -6 : 1 - day;

  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() + diff);
  startOfWeek.setHours(0, 0, 0, 0);

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const ordersData = [];
  const revenueData = [];

  for (let i = 0; i < 7; i++) {
    const start = new Date(startOfWeek);
    start.setDate(startOfWeek.getDate() + i);

    const end = new Date(start);
    end.setHours(23, 59, 59, 999);

    // Orders count
    const orders = await db.order.count({
      where: {
        tenantId,
        restaurantId,
        placedAt: {
          gte: start,
          lte: end,
        },
      },
    });

    // Revenue (only captured payments)
    const revenue = await db.payment.aggregate({
      where: {
        tenantId,
        status: "CAPTURED",
        order: {
          restaurantId,
        },
        paidAt: {
          gte: start,
          lte: end,
        },
      },
      _sum: {
        amount: true,
      },
    });

    ordersData.push(orders);
    revenueData.push(Number(revenue._sum.amount ?? 0));
  }

  return NextResponse.json({
    labels: days,
    orders: ordersData,
    revenue: revenueData,
  });
}