"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function updateKitchenOrderStatus(
  tenant: string,
  orderId: string,
  status: string
) {
  await db.order.update({
    where: {
      id: orderId,
    },
    data: {
      status,
    },
  });

  revalidatePath(`/${tenant}/kitchen`);
  revalidatePath(`/${tenant}/orders`);
}