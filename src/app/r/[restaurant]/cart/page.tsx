import CartClient from "./CartClient";

interface Props {
  params: Promise<{ restaurant: string }>;
}

export default async function CartPage({ params }: Props) {
  const { restaurant } = await params;

  return <CartClient restaurant={restaurant} />;
}