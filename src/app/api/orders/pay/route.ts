import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { orderId, amount, tenantId } = body;

    if (!orderId || !amount || !tenantId) {
      return NextResponse.json({ success: false });
    }

    await db.payment.create({
      data: {
        orderId,
        tenantId,
        status: "CAPTURED",
        method: "CASH",
        amount,
        currency: "INR",
        paidAt: new Date(),
      },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false });
  }
}