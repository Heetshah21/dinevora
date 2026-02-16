import { headers } from "next/headers";
import { requireTenant } from "@/modules/tenant/tenant.service";

export async function getTenant() {
  const headersList = headers();
  const slug = headersList.get("x-tenant-slug");

  if (!slug) {
    throw new Error("Tenant slug missing");
  }

  return requireTenant(slug);
}
