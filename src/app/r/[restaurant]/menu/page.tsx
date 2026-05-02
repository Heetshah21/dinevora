import { db } from "@/lib/db";
import AddToCartButton from "@/components/AddToCartButton";
import CartBar from "@/components/CartBar";
import TableSetter from "@/components/TableSetter";
import CustomerMenuClient from "@/components/CustomerMenuClient";

export default async function CustomerMenuPage({
  params,
  searchParams,
}: {
  params: Promise<{ restaurant: string }>;
  searchParams: Promise<{ table?: string }>;
}) {
  const { restaurant: restaurantSlug } = await params;
  const { table } = await searchParams;

  const restaurant = await db.restaurant.findFirst({
    where: {
      slug: restaurantSlug,
    },
  });

  const categories = await db.menuCategory.findMany({
    where: {
      tenantId: restaurant?.tenantId,
      restaurantId: restaurant?.id,
      isActive: true,
    },
    include: {
      menuItems: {
        where: {
          isAvailable: true,
        },
      },
    },
    orderBy: {
      position: "asc",
    },
  });

  return (
    <>
      <TableSetter />

      <div
        style={{
          padding: "18px 12px",
          maxWidth: "960px",
          margin: "0 auto",
          paddingBottom: "120px",
          boxSizing: "border-box",
          background: "#f5f6f8",
          borderRadius: "12px",
          boxShadow: "0 4px 14px rgba(0,0,0,0.06)",
          width: "100%",
        }}
      >
        <h1 style={{ margin: "0 0 16px", fontSize: "clamp(20px, 5vw, 24px)", color: "#111827" }}>
          {restaurant?.name}
        </h1>

        {table && <p style={{ color: "green" }}>Table: {table}</p>}

        <CustomerMenuClient categories={categories} />
        </div>

      <CartBar restaurant={restaurantSlug} />
    </>
  );
}