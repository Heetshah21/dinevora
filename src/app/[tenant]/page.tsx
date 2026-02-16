import { getTenant } from "@/lib/getTenant";

export default async function TenantPage() {
  const tenant = await getTenant();

  return (
    <div style={{ padding: 40 }}>
      <h1>{tenant.name}</h1>
      <p>Tenant resolved successfully 🚀</p>
    </div>
  );
}
