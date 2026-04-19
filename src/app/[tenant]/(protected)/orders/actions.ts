"use server";

import { db } from "@/lib/db";
import { requireAuth } from "@/lib/require-auth";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function createTestOrder(tenant: string) {
  const session = await requireAuth(tenant);

  const items = await db.menuItem.findMany({
    where: {
      tenantId: session.user.tenantId,
      restaurantId: session.user.restaurantId,
      isAvailable: true,
    },
    take: 2,
  });

  const subtotal = items.reduce(
    (sum, item) => sum + Number(item.price),
    0
  );

  await db.order.create({
    data: {
      tenantId: session.user.tenantId,
      restaurantId: session.user.restaurantId,
      subtotal: new Prisma.Decimal(subtotal),
      tax: new Prisma.Decimal(0),
      total: new Prisma.Decimal(subtotal),
      tableNumber: "1",
      items: {
        create: items.map((item) => ({
          tenantId: session.user.tenantId,
          name: item.name,
          menuItemId: item.id,
          unitPrice: item.price,
          quantity: 1,
          totalPrice: item.price,
        })),
      },
    },
  });

  revalidatePath(`/${tenant}/orders`);
}

export async function updateOrderStatus(
  tenant: string,
  formData: FormData
) {
  const session = await requireAuth(tenant);

  const orderId = formData.get("orderId") as string;
  const status = formData.get("status") as any;

  await db.order.update({
    where: { id: orderId },
    data: { status },
  });

  revalidatePath(`/${tenant}/orders`);
}

export async function markOrderPaid(tenant: string, formData: FormData) {
  const session = await requireAuth(tenant);

  const orderId = formData.get("orderId") as string;
  const amount = formData.get("amount") as string;

  await db.payment.create({
    data: {
      tenantId: session.user.tenantId,
      orderId: orderId,
      status: "CAPTURED",
      method: "CASH",
      amount: amount,
      currency: "INR",
      paidAt: new Date(),
    },
  });

}