"use server";

import { db } from "@/lib/db";
import { requireAuth } from "@/lib/require-auth";
import bcrypt from "bcrypt";

export async function changePassword(
  tenant: string,
  formData: FormData
) {
  try {
    const session = await requireAuth(tenant);

    const currentPassword = formData.get("currentPassword") as string;
    const newPassword = formData.get("newPassword") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (newPassword !== confirmPassword) {
      return { error: "New passwords do not match" };
    }

    const user = await db.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      return { error: "User not found" };
    }

    const valid = await bcrypt.compare(currentPassword, user.password);

    if (!valid) {
      return { error: "Current password incorrect" };
    }

    const hashed = await bcrypt.hash(newPassword, 10);

    await db.user.update({
      where: { id: user.id },
      data: { password: hashed },
    });

    return { success: true };
  } catch (err) {
    return { error: "Something went wrong" };
  }
}