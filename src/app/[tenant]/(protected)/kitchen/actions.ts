"use server";

import { db } from "@/lib/db";
import { requireAuth } from "@/lib/require-auth";
import { revalidatePath } from "next/cache";

export async function updateKitchenOrderStatus(
  tenant: string,
  orderId: string,
  status: any
) {
  const session = await requireAuth(tenant);

  await db.order.update({
    where: { id: orderId },
    data: { status },
  });

  revalidatePath(`/${tenant}/kitchen`);
  revalidatePath(`/${tenant}/orders`);
}