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

  const day = now.getDay();
  const diff = day === 0 ? -6 : 1 - day;

  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() + diff);
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

  // 🔥 ONE QUERY FOR ORDERS
  const orders = await db.order.findMany({
    where: {
      tenantId,
      restaurantId,
      placedAt: {
        gte: startOfWeek,
        lte: endOfWeek,
      },
    },
    select: {
      placedAt: true,
    },
  });

  // 🔥 ONE QUERY FOR PAYMENTS
  const payments = await db.payment.findMany({
    where: {
      tenantId,
      status: "CAPTURED",
      order: {
        restaurantId,
      },
      paidAt: {
        gte: startOfWeek,
        lte: endOfWeek,
      },
    },
    select: {
      paidAt: true,
      amount: true,
    },
  });

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const ordersData = Array(7).fill(0);
  const revenueData = Array(7).fill(0);

  // 🔥 GROUP IN MEMORY (FAST)
  orders.forEach((o) => {
    if (!o.placedAt) return; // 🔥 fix
  
    const d = new Date(o.placedAt);
    const index = (d.getDay() + 6) % 7;
    ordersData[index]++;
  });

  payments.forEach((p) => {
    if (!p.paidAt) return; // 🔥 fix
  
    const d = new Date(p.paidAt);
    const index = (d.getDay() + 6) % 7;
    revenueData[index] += Number(p.amount);
  });

  return NextResponse.json({
    labels: days,
    orders: ordersData,
    revenue: revenueData,
  });
}