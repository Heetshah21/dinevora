import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const tenantId = searchParams.get("tenantId");
  const restaurantId = searchParams.get("restaurantId");

  if (!tenantId || !restaurantId) {
    return NextResponse.json({ error: "Missing params" });
  }

  const orders = await db.order.findMany({
    where: {
      tenantId,
      restaurantId,
      status: {
        in: ["PENDING", "CONFIRMED"],
      },
    },
    select: {
      id: true,
      orderCode: true,
      status: true,
      placedAt: true,
      items: {
        select: {
          id: true,
          name: true,
          quantity: true,
        },
      },
    },
    orderBy: {
      placedAt: "asc",
    },
  });

  return NextResponse.json(orders);
}