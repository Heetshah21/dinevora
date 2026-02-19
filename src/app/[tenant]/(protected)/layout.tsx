import Link from "next/link";
import { requireAuth } from "@/lib/require-auth";
import { db } from "@/lib/db";
import { signOut } from "@/auth";

interface Props {
  children: React.ReactNode;
  params: Promise<{ tenant: string }>;
}

export default async function TenantLayout({
  children,
  params,
}: Props) {
  const { tenant } = await params;

  const session = await requireAuth(tenant); // ✅ STORE SESSION

  const restaurant = await db.restaurant.findFirst({
    where: {
      tenantId: session.user.tenantId,
    },
  });

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar */}
      <aside
        style={{
          width: "250px",
          background: "#111",
          color: "white",
          padding: "20px",
        }}
      >
        <h2 style={{ marginBottom: "30px" }}>
          {restaurant?.name || "Servora"}
        </h2>

        <nav style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <Link href={`/${tenant}/dashboard`} style={{ color: "white" }}>
            Dashboard
          </Link>

          <Link href={`/${tenant}/menu`} style={{ color: "white" }}>
            Menu
          </Link>

          <Link href={`/${tenant}/orders`} style={{ color: "white" }}>
            Orders
          </Link>

          <Link href={`/${tenant}/settings`} style={{ color: "white" }}>
            Settings
          </Link>
        </nav>

        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: `/${tenant}/login` });
          }}
          style={{ marginTop: "40px" }}
        >
          <button
            type="submit"
            style={{
              background: "red",
              color: "white",
              padding: "8px 12px",
              border: "none",
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        </form>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: "40px" }}>{children}</main>
    </div>
  );
}
