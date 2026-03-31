export const dynamic = "force-dynamic";
export const revalidate = 0;
import { db } from "@/lib/db";
import QRClient from "./QRClient";

interface Props {
  params: Promise<{ tenant: string }>;
}

export default async function QRPage({ params }: Props) {
  const { tenant } = await params;

  const restaurant = await db.restaurant.findFirst({
    where: {
      tenant: {
        slug: tenant,
      },
    },
  });

  if (!restaurant) {
    return <div>Restaurant not found</div>;
  }

  return <QRClient shortCode={restaurant.shortCode} />;
}