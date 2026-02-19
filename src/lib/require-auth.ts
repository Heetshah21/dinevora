import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";


export async function requireAuth(expectedTenantSlug: string) {
  const session = await auth();

  if (!session) {
    redirect(`/${expectedTenantSlug}/login`);
  }

  // Get tenant from DB
  const tenant = await db.tenant.findUnique({
    where: { slug: expectedTenantSlug },
  });

  if (!tenant) {
    redirect("/");
  }

  // Logged in but wrong tenant
  if (session.user.tenantId !== tenant.id) {
    redirect(`/${expectedTenantSlug}/login`);
  }
  return session;
}
