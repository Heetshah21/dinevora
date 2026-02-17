import { auth, signOut } from "@/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

type Props = {
  params: {
    tenant: string;
  };
};

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ tenant: string }>;
}) {
  const { tenant } = await params; // ⭐ VERY IMPORTANT

  const session = await auth();

  const tenantData = await db.tenant.findUnique({
    where: { slug: tenant },
  });
  
  if (!session?.user) {
    redirect(`/${tenant}/login`);
  }
  
  if (!tenantData || tenantData.id !== session.user.tenantId) {
    redirect(`/${tenant}/login`);
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>Dashboard</h1>

      <p>Tenant: {tenant}</p>
      <p>User ID: {session.user.id}</p>
      <p>Role: {session.user.role}</p>

      <br />

      <h2>🔥 Multi-tenant auth is working.</h2>
    </div>
  );
}

  