export const revalidate = 10;
import { requireAuth } from "@/lib/require-auth";
import { db } from "@/lib/db";
import { updateRestaurantSettings } from "./actions";
import { changePassword } from "./password-actions";
import ChangePasswordForm from "./ChangePasswordForm";
interface Props {
  params: Promise<{ tenant: string }>;
}

export default async function SettingsPage({ params }: Props) {
  const { tenant } = await params;

  const session = await requireAuth(tenant);

  const restaurant = await db.restaurant.findFirst({
    where: {
      tenantId: session.user.tenantId,
    },
  });

  return (
    <div>
      <h1 style={{ margin: "0 0 20px", fontSize: "28px", color: "#111827" }}>Restaurant Settings</h1>

      <form
        action={async (formData: FormData) => {
          "use server";
          await updateRestaurantSettings(tenant, formData);
        }}
        encType="multipart/form-data"
        style={{
          background: "#fff",
          border: "1px solid #e5e7eb",
          borderRadius: "10px",
          padding: "16px",
          display: "grid",
          gap: "14px",
          maxWidth: "720px",
        }}
      >
        <input type="hidden" name="restaurantId" value={restaurant?.id} />

        <div>
          <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", color: "#4b5563" }}>Restaurant Name</label>
          <br />
          <input
            name="name"
            defaultValue={restaurant?.name || ""}
            style={{
              width: "100%",
              maxWidth: "480px",
              padding: "10px 12px",
              borderRadius: "8px",
              border: "1px solid #d1d5db",
              boxSizing: "border-box",
            }}
          />
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", color: "#4b5563" }}>Currency</label>
          <br />
          <input
            name="currency"
            defaultValue={restaurant?.currency || "INR"}
            style={{
              width: "100%",
              maxWidth: "240px",
              padding: "10px 12px",
              borderRadius: "8px",
              border: "1px solid #d1d5db",
              boxSizing: "border-box",
            }}
          />
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", color: "#4b5563" }}>Tax %</label>
          <br />
          <input
            name="taxPercent"
            type="number"
            step="0.01"
            defaultValue={restaurant?.taxPercent?.toString() || "0"}
            style={{
              width: "100%",
              maxWidth: "240px",
              padding: "10px 12px",
              borderRadius: "8px",
              border: "1px solid #d1d5db",
              boxSizing: "border-box",
            }}
          />
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", color: "#4b5563" }}>Service Charge %</label>
          <br />
          <input
            name="servicePercent"
            type="number"
            step="0.01"
            defaultValue={restaurant?.servicePercent?.toString() || "0"}
            style={{
              width: "100%",
              maxWidth: "240px",
              padding: "10px 12px",
              borderRadius: "8px",
              border: "1px solid #d1d5db",
              boxSizing: "border-box",
            }}
          />
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", color: "#4b5563" }}>Restaurant Logo</label>
          <br />
          <input type="file" name="logo" accept="image/*" />
        </div>

        <div>
        <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", color: "#4b5563" }}>
          Phone Number
        </label>
        <input
          name="phone"
          defaultValue={restaurant?.phone || ""}
          style={{
            width: "100%",
            maxWidth: "300px",
            padding: "10px 12px",
            borderRadius: "8px",
            border: "1px solid #d1d5db",
          }}
        />
      </div>

      <div>
        <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", color: "#4b5563" }}>
          UPI ID
        </label>
        <input
          name="upiId"
          defaultValue={restaurant?.upiId || ""}
          style={{
            width: "100%",
            maxWidth: "300px",
            padding: "10px 12px",
            borderRadius: "8px",
            border: "1px solid #d1d5db",
          }}
        />
      </div>

      <div style={{ display: "flex", gap: "20px", marginTop: "10px" }}>
        <label>
          <input
            type="checkbox"
            name="acceptsDineIn"
            defaultChecked={restaurant?.acceptsDineIn}
          />{" "}
          Accept Dine In
        </label>

        <label>
          <input
            type="checkbox"
            name="acceptsTakeaway"
            defaultChecked={restaurant?.acceptsTakeaway}
          />{" "}
          Accept Takeaway
        </label>

        <label>
          <input
            type="checkbox"
            name="acceptsDelivery"
            defaultChecked={restaurant?.acceptsDelivery}
          />{" "}
          Accept Delivery
        </label>
      </div>
      <ChangePasswordForm tenant={tenant} />

        <button
          type="submit"
          style={{
            marginTop: "6px",
            width: "fit-content",
            padding: "10px 14px",
            borderRadius: "8px",
            border: "none",
            background: "#111827",
            color: "#fff",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: 500,
          }}
        >
          Save Settings
        </button>
      </form>
    </div>
  );
}