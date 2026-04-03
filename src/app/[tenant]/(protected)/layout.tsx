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

  const session = await requireAuth(tenant); // ✅ STORE SESSION

  const restaurant = await db.restaurant.findFirst({
    where: {
      tenantId: session.user.tenantId,
    },
  });

  return (
    <div
      className="servoraTenantLayoutRoot"
      style={{ display: "flex", minHeight: "100vh", background: "#f3f4f6" }}
    >
      {/* CSS-only sidebar toggle (no backend/routing/auth changes). */}
      <input
        id="servoraSidebarToggle"
        type="checkbox"
        className="servoraSidebarToggleInput"
        aria-hidden="true"
      />

      {/* Mobile-only backdrop to close the sidebar. */}
      <label
        htmlFor="servoraSidebarToggle"
        className="servoraMobileBackdrop"
        aria-hidden="true"
      />

      {/* Mobile-only top bar with restaurant name. */}
      <div className="servoraMobileTopbar">
        <label
          htmlFor="servoraSidebarToggle"
          className="servoraMobileMenuButton"
          aria-label="Open navigation"
        >
          Menu
        </label>
        <div className="servoraMobileRestaurantName">
          {restaurant?.name || "Servora"}
        </div>
      </div>

      <aside
        className="servoraSidebar"
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

      <main
        className="servoraMain"
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

      <style jsx global>{`
        /* Mobile responsiveness only: keep desktop layout exactly as-is. */
        .servoraSidebarToggleInput {
          display: none;
        }

        .servoraMobileTopbar {
          display: none;
        }

        .servoraMobileBackdrop {
          display: none;
        }

        @media (max-width: 768px) {
          .servoraTenantLayoutRoot {
            overflow-x: hidden;
          }

          /* If any tables exist inside protected pages, allow horizontal scrolling on mobile. */
          table {
            display: block;
            width: 100%;
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
          }

          .servoraMobileTopbar {
            display: flex;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            z-index: 60;
            align-items: center;
            gap: 12px;
            padding: 12px 14px;
            background: #f3f4f6;
            border-bottom: 1px solid #e5e7eb;
            box-sizing: border-box;
          }

          .servoraMobileRestaurantName {
            font-size: 16px;
            font-weight: 700;
            color: #111827;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .servoraMobileMenuButton {
            flex: 0 0 auto;
            padding: 8px 12px;
            background: #111827;
            color: #fff;
            border-radius: 8px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            user-select: none;
          }

          .servoraMobileBackdrop {
            display: block;
            position: fixed;
            inset: 0;
            z-index: 55;
            background: rgba(0, 0, 0, 0.15);
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.15s ease;
          }

          #servoraSidebarToggle:checked ~ .servoraMobileBackdrop {
            opacity: 1;
            pointer-events: auto;
          }

          .servoraSidebar {
            transform: translateX(-260px) !important;
            top: 56px !important;
            height: calc(100vh - 56px) !important;
            z-index: 56;
          }

          #servoraSidebarToggle:checked ~ .servoraSidebar {
            transform: translateX(0) !important;
          }

          .servoraMain {
            margin-left: 0 !important;
            width: 100% !important;
            padding-top: 84px !important; /* reserve space for the fixed top bar */
          }

          /* Shared page responsive helpers (opt-in via className). */
          .servoraStackMobile {
            grid-template-columns: 1fr !important;
          }

          .servoraFormFullWidthMobile {
            width: 100% !important;
            max-width: none !important;
            box-sizing: border-box !important;
          }

          .servoraFullWidthMobileInput {
            width: 100% !important;
            max-width: none !important;
            min-width: 0 !important;
            box-sizing: border-box !important;
          }

          .servoraNoRightMarginMobile {
            margin-right: 0 !important;
          }
        }
      `}</style>
    </div>
  );
}
