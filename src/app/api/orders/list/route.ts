import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { OrderStatus } from "@prisma/client";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const tenantId = searchParams.get("tenantId");
  const restaurantId = searchParams.get("restaurantId");
  const type = searchParams.get("type");

  if (!tenantId || !restaurantId) {
    return NextResponse.json({ error: "Missing params" });
  }

  let statusFilter:
    | { in: OrderStatus[] }
    | { not: OrderStatus };

  if (type === "kitchen") {
    statusFilter = {
      in: [OrderStatus.PENDING, OrderStatus.CONFIRMED],
    };
  } else {
    statusFilter = {
      not: OrderStatus.CANCELLED,
    };
  }

  const orders = await db.order.findMany({
    where: {
      tenantId,
      restaurantId,
      status: statusFilter,
    },
    select: {
      id: true,
      orderCode: true,
      status: true,
      placedAt: true,

      source: true,
      tableNumber: true,
      customerName: true,
      notes: true,

      items: {
        select: {
          id: true,
          name: true,
          quantity: true,
          isJain: true,
          notes: true,
        },
      },
    }, // ✅ FIXED comma here
    orderBy: {
      placedAt: "asc",
    },
  });

  return NextResponse.json(orders);
}