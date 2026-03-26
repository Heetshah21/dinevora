import OrderStatusClient from "./OrderStatusClient";

interface Props {
  params: Promise<{
    restaurant: string;
    orderId: string;
  }>;
}

export default async function Page({ params }: Props) {
  const {restaurant, orderId } = await params;

  return <OrderStatusClient restaurant={restaurant} orderId={orderId} />;
}