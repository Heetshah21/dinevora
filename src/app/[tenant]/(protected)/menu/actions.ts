"use server";

import { db } from "@/lib/db";
import { requireAuth } from "@/lib/require-auth";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import cloudinary from "@/lib/cloudinary";

export async function createCategory(
  tenant: string,
  formData: FormData
) {
  const session = await requireAuth(tenant);

  // Optional RBAC check
  if (session.user.role !== "OWNER" && session.user.role !== "MANAGER") {
    throw new Error("Unauthorized");
  }

  const name = formData.get("name") as string;

  if (!name || name.trim() === "") {
    throw new Error("Category name is required");
  }

  await db.menuCategory.create({
    data: {
      name,
      tenantId: session.user.tenantId,
      restaurantId: session.user.restaurantId,
    },
  });

  revalidatePath(`/${tenant}/menu`);
}
export async function createMenuItem(
  tenant: string,
  formData: FormData
) {
  const session = await requireAuth(tenant);

  const name = formData.get("name") as string;
  const price = formData.get("price") as string;
  const description = formData.get("description") as string;
  const categoryId = formData.get("categoryId") as string;
  const isJainAvailable = formData.get("isJainAvailable") === "on";
  if (!name || !price) {
    throw new Error("Name and price are required");
  }
  const imageFile = formData.get("image") as File;

let imageUrl: string | null = null;

if (imageFile && imageFile.size > 0) {
  const bytes = await imageFile.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const upload = await new Promise<any>((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder: "servora/menu-items" }, (error, result) => {
        if (error) reject(error);
        else resolve(result);
      })
      .end(buffer);
  });

  imageUrl = upload.secure_url;
}

  await db.menuItem.create({
    data: {
      name,
      description: description || null,
      price: new Prisma.Decimal(price),
      tenantId: session.user.tenantId,
      restaurantId: session.user.restaurantId,
      categoryId,
      isJainAvailable,
      imageUrl,
    },
  });

  revalidatePath(`/${tenant}/menu`);
}
export async function deleteMenuItem(
  tenant: string,
  formData: FormData
) {
  const session = await requireAuth(tenant);

  const itemId = formData.get("itemId") as string;

  if (!itemId) {
    throw new Error("Item id missing");
  }

  await db.menuItem.delete({
    where: {
      id: itemId,
      tenantId: session.user.tenantId,
      restaurantId: session.user.restaurantId,
    },
  });

  revalidatePath(`/${tenant}/menu`);
}
export async function updateMenuItem(
  tenant: string,
  formData: FormData
) {
  const session = await requireAuth(tenant);

  const itemId = formData.get("itemId") as string;
  const name = formData.get("name") as string;
  const price = formData.get("price") as string;
  const description = formData.get("description") as string;
  const isJainAvailable = formData.get("isJainAvailable") === "on";
  const imageFile = formData.get("image") as File;

let imageUrl: string | null = null;

if (imageFile && imageFile.size > 0) {
  const bytes = await imageFile.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const upload = await new Promise<any>((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder: "servora/menu-items" }, (error, result) => {
        if (error) reject(error);
        else resolve(result);
      })
      .end(buffer);
  });

  imageUrl = upload.secure_url;
}
  if (!itemId || !name || !price) {
    throw new Error("Missing required fields");
  }

  await db.menuItem.update({
    where: {
      id: itemId,
    },
    data: {
      name,
      price: new Prisma.Decimal(price),
      description: description || null,
      isJainAvailable,
      ...(imageUrl && { imageUrl }),
    },
  });

  revalidatePath(`/${tenant}/menu`);
}
export async function toggleItemAvailability(
  tenant: string,
  formData: FormData
) {
  const session = await requireAuth(tenant);

  const itemId = formData.get("itemId") as string;
  const isAvailable = formData.get("isAvailable") === "on";

  await db.menuItem.update({
    where: {
      id: itemId,
    },
    data: {
      isAvailable,
    },
  });

  revalidatePath(`/${tenant}/menu`);
}