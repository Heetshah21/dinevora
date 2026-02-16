import { db } from "@/lib/db";
import { getCachedTenant, setCachedTenant } from "@/lib/tenant-cache";

const inflightTenantRequests = new Map<string, Promise<any>>();
export async function requireTenant(slug: string) {

  // ✅ 1. Try cache first
  const cached = getCachedTenant(slug);
  if (cached) {
    console.log("⚡ Tenant served from cache");
    return cached;
  }
  if (inflightTenantRequests.has(slug)) {
    console.log("🟡 Awaiting existing tenant request");
    return inflightTenantRequests.get(slug)!;
  }
  const tenantPromise = db.tenant.findUnique({
    where: { slug },
  }).then((tenant) => {

    if (!tenant) {
      throw new Error(`Tenant not found for slug: ${slug}`);
    }

    setCachedTenant(slug, tenant);

    console.log("🐢 Tenant served from DB");

    inflightTenantRequests.delete(slug);

    return tenant;
  });

  // store promise BEFORE awaiting
  inflightTenantRequests.set(slug, tenantPromise);

  return tenantPromise;
}


