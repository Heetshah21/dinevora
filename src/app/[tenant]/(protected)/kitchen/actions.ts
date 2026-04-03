"use server";

import { db } from "@/lib/db";
import { requireAuth } from "@/lib/require-auth";
import { revalidatePath } from "next/cache";
import { OrderStatus } from "@prisma/client";

export async function updateKitchenOrderStatus(
  tenant: string,
  formData: FormData
) {
  const session = await requireAuth(tenant);

  const orderId = formData.get("orderId") as string;
  const status = formData.get("status") as OrderStatus;

  if (!orderId || !status) {
    throw new Error("Missing orderId or status");
  }

  await db.order.update({
    where: {
      id: orderId,
      tenantId: session.user.tenantId,
    },
    data: {
      status: status,
    },
  });

  revalidatePath(`/${tenant}/kitchen`);
  revalidatePath(`/${tenant}/orders`);
}