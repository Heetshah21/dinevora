export const dynamic = "force-dynamic";
export const revalidate = 0;

import { requireAuth } from "@/lib/require-auth";
import { db } from "@/lib/db";
import KitchenClient from "@/components/KitchenClient";

interface Props {
  params: Promise<{ tenant: string }>;
}

export default async function KitchenPage({ params }: Props) {
  const { tenant } = await params;
  const session = await requireAuth(tenant);

  const rawOrders = await db.order.findMany({
    where: {
      tenantId: session.user.tenantId,
      restaurantId: session.user.restaurantId,
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
  
  const orders = rawOrders
  .filter(
    (o): o is typeof o & { status: "PENDING" | "CONFIRMED" } =>
      o.status === "PENDING" || o.status === "CONFIRMED"
  )
  .map((o) => ({
    id: o.id,
    orderCode: o.orderCode ?? "-",
    status: o.status,
    placedAt: o.placedAt.toISOString(),
    items: o.items,
  }));

  return (
    <div>
      <h1>Kitchen Board</h1>
  
      <KitchenClient
        initialOrders={orders}
        tenantId={session.user.tenantId}
        restaurantId={session.user.restaurantId}
      />
    </div>
  );
}