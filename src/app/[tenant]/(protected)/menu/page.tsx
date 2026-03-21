import { requireAuth } from "@/lib/require-auth";
import { db } from "@/lib/db";
import { createCategory, createMenuItem } from "./actions";
import MenuItemCard from "./MenuItemCard";

interface Props {
  params: Promise<{ tenant: string }>;
}

export default async function MenuPage({ params }: Props) {
  const { tenant } = await params;

  const session = await requireAuth(tenant);

  const categories = await db.menuCategory.findMany({
    where: {
      tenantId: session.user.tenantId,
    },
    include: {
      menuItems: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  return (
    <div>
      <h1 style={{ margin: "0 0 20px", fontSize: "28px", color: "#111827" }}>Menu Management</h1>
      <form
        action={async (formData: FormData) => {
          "use server";
          await createCategory(tenant, formData);
        }}
        encType="multipart/form-data"
        style={{
          marginBottom: "24px",
          background: "#fff",
          border: "1px solid #e5e7eb",
          borderRadius: "10px",
          padding: "16px",
          display: "flex",
          flexWrap: "wrap",
          gap: "10px",
          alignItems: "center",
        }}
      >
        <input
          type="text"
          name="name"
          placeholder="New Category Name"
          style={{
            padding: "10px 12px",
            borderRadius: "8px",
            border: "1px solid #d1d5db",
            minWidth: "220px",
            flex: "1 1 260px",
            fontSize: "14px",
          }}
        />
        <button
          type="submit"
          style={{
            padding: "10px 14px",
            borderRadius: "8px",
            border: "none",
            background: "#111827",
            color: "white",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: 500,
          }}
        >
          Add Category
        </button>
      </form>

      {categories.length === 0 && <p>No categories found.</p>}

      {categories.map((category) => (
        <section
          key={category.id}
          style={{
            marginBottom: "24px",
            border: "1px solid #e5e7eb",
            borderRadius: "10px",
            background: "#fff",
            padding: "16px",
          }}
        >
          <h2 style={{ margin: "0 0 14px", fontSize: "20px", color: "#111827" }}>{category.name}</h2>
          <form
            action={async (formData: FormData) => {
              "use server";
              await createMenuItem(tenant, formData);
            }}
            style={{
              marginTop: "10px",
              marginBottom: "14px",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "10px",
              alignItems: "end",
            }}
          >
            <input type="hidden" name="categoryId" value={category.id} />

            <input
              name="name"
              placeholder="Item name"
              required
              style={{
                padding: "10px 12px",
                borderRadius: "8px",
                border: "1px solid #d1d5db",
                width: "100%",
                boxSizing: "border-box",
              }}
            />

            <div>
              <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", color: "#4b5563" }}>
                Menu Image
              </label>
              <input type="file" name="image" accept="image/*" />
            </div>

            <input
              name="price"
              type="number"
              step="0.01"
              placeholder="Price"
              required
              style={{
                padding: "10px 12px",
                borderRadius: "8px",
                border: "1px solid #d1d5db",
                width: "100%",
                boxSizing: "border-box",
              }}
            />

            <input
              name="description"
              placeholder="Description"
              style={{
                padding: "10px 12px",
                borderRadius: "8px",
                border: "1px solid #d1d5db",
                width: "100%",
                boxSizing: "border-box",
              }}
            />
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "14px",
                color: "#374151",
                minHeight: "42px",
              }}
            >
              <input type="checkbox" name="isJainAvailable" />
              Jain
            </label>
            <button
              type="submit"
              style={{
                padding: "10px 12px",
                borderRadius: "8px",
                border: "none",
                background: "#111827",
                color: "white",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: 500,
                width: "fit-content",
              }}
            >
              Add Item
            </button>
          </form>
          {category.menuItems.length === 0 && (
            <p style={{ color: "#6b7280", margin: 0 }}>No items in this category.</p>
          )}

          {category.menuItems.map((item) => (
            <MenuItemCard
              key={item.id}
              tenant={tenant}
              item={{
                ...item,
                price: item.price.toString(),
                imageUrl: item.imageUrl,
              }}
            />
          ))}
        </section>
      ))}
    </div>

  );
}
