import QRClient from "./QRClient";

interface Props {
  params: Promise<{ tenant: string }>;
}

export default async function QRPage({ params }: Props) {
  const { tenant } = await params;

  return <QRClient tenant={tenant} />;
}