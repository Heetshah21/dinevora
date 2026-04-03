import { requireAuth } from "@/lib/require-auth";
import { db } from "@/lib/db";
import { signOut } from "@/auth";
import SidebarNavLink from "./SidebarNavLink";

interface Props {
  children: React.ReactNode;
  params: Promise<{ tenant: string }>;
}

export default async function TenantLayout({
  children,
  params,
}: Props) {
  const { tenant } = await params;

  const session = await requireAuth(tenant);

  const restaurant = await db.restaurant.findFirst({
    where: {
      tenantId: session.user.tenantId,
    },
  });

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "#f3f4f6",
      }}
    >
      {/* Sidebar */}
      <aside
        style={{
          width: "250px",
          background: "#ffffff",
          color: "#111827",
          padding: "24px 16px",
          position: "fixed",
          top: 0,
          left: 0,
          height: "100vh",
          overflowY: "auto",
          borderRight: "1px solid #e5e7eb",
        }}
      >
        <h2
          style={{
            marginBottom: "24px",
            fontSize: "20px",
            fontWeight: 700,
            lineHeight: 1.2,
          }}
        >
          {restaurant?.name || "Servora"}
        </h2>

        <nav style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <SidebarNavLink href={`/${tenant}/dashboard`} label="Dashboard" />
          <SidebarNavLink href={`/${tenant}/menu`} label="Menu" />
          <SidebarNavLink href={`/${tenant}/orders`} label="Orders" />
          <SidebarNavLink
            href={`/${tenant}/orders/history`}
            label="Orders History"
          />
          <SidebarNavLink href={`/${tenant}/kitchen`} label="Kitchen" />
          <SidebarNavLink href={`/${tenant}/qr`} label="QR Codes" />
          <SidebarNavLink href={`/${tenant}/settings`} label="Settings" />
        </nav>

        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: `/${tenant}/login` });
          }}
          style={{ marginTop: "24px" }}
        >
          <button
            type="submit"
            style={{
              width: "100%",
              background: "#111827",
              color: "white",
              padding: "10px 12px",
              border: "none",
              cursor: "pointer",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: 500,
            }}
          >
            Logout
          </button>
        </form>
      </aside>

      {/* Main */}
      <main
        style={{
          marginLeft: "250px",
          width: "calc(100% - 250px)",
          padding: "28px",
          maxWidth: "1600px",
          minHeight: "100vh",
          background: "#f3f4f6",
          boxSizing: "border-box",
        }}
      >
        {children}
      </main>
    </div>
  );
}