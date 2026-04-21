export const dynamic = "force-dynamic";
export const revalidate = 0;

import { requireAuth } from "@/lib/require-auth";
import { db } from "@/lib/db";
import OrdersClient from "@/components/OrdersClient";
import { OrderStatus } from "@prisma/client";

interface Props {
  params: Promise<{ tenant: string }>;
}

export default async function OrdersPage({ params }: Props) {
  const { tenant } = await params;
  const session = await requireAuth(tenant);

  const rawOrders = await db.order.findMany({
    where: {
      tenantId: session.user.tenantId,
      restaurantId: session.user.restaurantId,
      status: {
        not: OrderStatus.CANCELLED, // ✅ use enum (not string)
      },
    },
    select: {
      id: true,
      orderCode: true,
      status: true,
      total: true,
      placedAt: true, // ✅ include (useful + consistent)
      items: {
        select: {
          id: true,
          name: true,
          quantity: true,
        },
      },
    },
    orderBy: {
      placedAt: "desc",
    },
  });

  // ✅ Normalize data (VERY IMPORTANT for client)
  const orders = rawOrders.map((o) => ({
    id: o.id,
    orderCode: o.orderCode ?? "-",
    status: o.status,
    total: Number(o.total ?? 0), // ✅ safe fallback
    placedAt: o.placedAt.toISOString(), // ✅ serialize date
    items: o.items,
  }));

  return (
    <div>
      <h1 style={{ marginBottom: "20px" }}>Orders</h1>

      <OrdersClient
        initialOrders={orders}
        tenantId={session.user.tenantId}
        restaurantId={session.user.restaurantId}
      />
    </div>
  );
}