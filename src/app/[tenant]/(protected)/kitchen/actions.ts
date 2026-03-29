"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { OrderStatus } from "@prisma/client";
export async function updateKitchenOrderStatus(
  tenant: string,
  orderId: string,
  status: OrderStatus
) {
  await db.order.update({
    where: {
      id: orderId,
    },
    data: {
      status: status,
    },
  });

  revalidatePath(`/${tenant}/kitchen`);
  revalidatePath(`/${tenant}/orders`);
}