import { db } from "@/lib/db";
import { redirect } from "next/navigation";

interface Props {
  params: Promise<{ code: string }>;
  searchParams: Promise<{ table?: string }>;
}

export default async function ShortLinkPage({ params, searchParams }: Props) {
  const { code } = await params;
  const { table } = await searchParams;

  const restaurant = await db.restaurant.findFirst({
    where: {
      shortCode: code,
      isActive: true,
    },
  });

  if (!restaurant) {
    return <div>Restaurant not found</div>;
  }

  // Redirect to menu with optional table number
  if (table) {
    redirect(`/r/${restaurant.slug}/menu?table=${table}`);
  } else {
    redirect(`/r/${restaurant.slug}/menu`);
  }
}