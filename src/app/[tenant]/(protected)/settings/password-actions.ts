"use server";

import { db } from "@/lib/db";
import { requireAuth } from "@/lib/require-auth";
import bcrypt from "bcrypt";
import { revalidatePath } from "next/cache";

export async function changePassword(
  tenant: string,
  formData: FormData
) {
  const session = await requireAuth(tenant);

  const currentPassword = formData.get("currentPassword") as string;
  const newPassword = formData.get("newPassword") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (newPassword !== confirmPassword) {
    throw new Error("New passwords do not match");
  }

  if (newPassword.length < 6) {
    throw new Error("Password must be at least 6 characters");
  }

  const user = await db.user.findUnique({
    where: {
      id: session.user.id,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const valid = await bcrypt.compare(currentPassword, user.password);

  if (!valid) {
    throw new Error("Current password incorrect");
  }

  const hashed = await bcrypt.hash(newPassword, 10);

  await db.user.update({
    where: {
      id: user.id,
    },
    data: {
      password: hashed,
    },
  });

  revalidatePath(`/${tenant}/settings`);
}