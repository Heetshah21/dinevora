/*import { requireAuth } from "@/lib/require-auth";

interface Props {
  params: {
    tenant: string;
  };
}

export default async function DashboardPage({ params }: Props) {
  const { tenant } = await params; // ⭐ MUST await

  const session = await requireAuth(tenant);

  const restaurant = await db.restaurant.findFirst({
    where: {
      tenantId: session.user.tenantId,
    },
  });

  const categories = await db.menuCategory.findMany({
    where: {
      tenantId: session.user.tenantId,
    },
    orderBy: {
      position: "asc",
    },
  });
  return (
    <div style={{ padding: 40 }}>
      <h1>{restaurant?.name} Dashboard</h1>

      <h2>Categories</h2>
      <ul>
        {categories.map((cat) => (
          <li key={cat.id}>{cat.name}</li>
        ))}
      </ul>
    </div>
  );
}*/
export default function DashboardPage() {
  return <h1>Dashboard</h1>;
}
