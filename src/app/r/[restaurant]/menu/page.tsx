import { db } from "@/lib/db";
import AddToCartButton from "@/components/AddToCartButton";
import CartBar from "@/components/CartBar";
import TableSetter from "@/components/TableSetter";

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

        {(categories as typeof categories).map((category: typeof categories[number]) => (
          <div key={category.id} style={{ marginBottom: "26px" }}>
            <div
              style={{
                position: "sticky",
                top: 0,
                zIndex: 10,
                background: "rgba(245, 246, 248, 0.85)",
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
                padding: "10px 0",
                borderBottom: "1px solid #e5e7eb",
              }}
            >
              <h2 style={{ margin: 0, fontSize: "18px", color: "#111827" }}>
                {category.name}
              </h2>
            </div>

            <div style={{ display: "grid", gap: "14px", paddingTop: "12px" }}>
              {category.menuItems.map((item: typeof categories[number]["menuItems"][number]) => (
                <div
                  key={item.id}
                  className="menu-item-card"
                  style={{
                    display: "flex",
                    gap: "14px",
                    padding: "14px",
                    border: "1px solid #e5e7eb",
                    borderRadius: "12px",
                    background: "#ffffff",
                    boxSizing: "border-box",
                    boxShadow: "0 4px 14px rgba(0,0,0,0.06)",
                    flexWrap: "nowrap",
                  }}
                >
                  {item.imageUrl && (
                    <img
                      src={item.imageUrl}
                      className="menu-item-image"
                      style={{
                        width: "80px",
                        height: "80px",
                        objectFit: "cover",
                        borderRadius: "12px",
                        flex: "0 0 auto",
                      }}
                      alt={item.name}
                    />
                  )}

                  <div className="menu-item-body" style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px", flexWrap: "nowrap" }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <strong style={{ display: "block", color: "#111827", fontSize: "15px" }}>
                          {item.name}
                        </strong>
                        {item.description && (
                          <p style={{ margin: "6px 0 0", color: "#6b7280", fontSize: "13px", lineHeight: 1.35 }}>
                            {item.description}
                          </p>
                        )}
                      </div>

                      <div style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                        <div style={{ fontWeight: 700, color: "#111827" }}>
                          ₹{item.price.toString()}
                        </div>
                        {item.isJainAvailable && (
                          <span
                            style={{
                              marginTop: "8px",
                              display: "inline-flex",
                              padding: "4px 8px",
                              borderRadius: "999px",
                              fontSize: "12px",
                              background: "#ecfdf3",
                              border: "1px solid #bbf7d0",
                              color: "#166534",
                              fontWeight: 600,
                            }}
                          >
                            Jain Available
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div
  style={{
    flex: 1,
    minWidth: 0,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "12px",
  }}
>
  {/* LEFT SIDE */}
  <div style={{ flex: 1 }}>
    <strong style={{ fontSize: "15px" }}>
      {item.name}
    </strong>

    {item.description && (
      <p style={{ fontSize: "13px" }}>
        {item.description}
      </p>
    )}

    <div style={{ fontWeight: 700 }}>
      ₹{item.price}
    </div>
  </div>

  {/* RIGHT SIDE BUTTON */}
  <AddToCartButton
    item={{
      id: item.id,
      name: item.name,
      price: Number(item.price),
      imageUrl: item.imageUrl,
      isJainAvailable: item.isJainAvailable,
    }}
  />
</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <CartBar restaurant={restaurantSlug} />
    </>
  );
}