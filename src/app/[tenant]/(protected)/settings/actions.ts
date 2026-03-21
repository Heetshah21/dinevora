"use server";

import { db } from "@/lib/db";
import { requireAuth } from "@/lib/require-auth";
import { revalidatePath } from "next/cache";
import cloudinary from "@/lib/cloudinary";
import { Prisma } from "@prisma/client";

export async function updateRestaurantSettings(
  tenant: string,
  formData: FormData
) {
  const session = await requireAuth(tenant);

  const restaurantId = formData.get("restaurantId") as string;
  const name = formData.get("name") as string;
  const currency = formData.get("currency") as string;
  const taxPercent = formData.get("taxPercent") as string;
  const servicePercent = formData.get("servicePercent") as string;

  const logoFile = formData.get("logo") as File;

  let logoUrl: string | null = null;

  if (logoFile && logoFile.size > 0) {
    const bytes = await logoFile.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const upload = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder: "servora/logos" }, (error, result) => {
          if (error) reject(error);
          else resolve(result);
        })
        .end(buffer);
    });

    logoUrl = upload.secure_url;
  }

  await db.restaurant.update({
    where: { id: restaurantId },
    data: {
      name,
      currency,
      taxPercent: new Prisma.Decimal(taxPercent),
      servicePercent: new Prisma.Decimal(servicePercent),
      ...(logoUrl && { logoUrl }),
    },
  });

  revalidatePath(`/${tenant}/settings`);
}