import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

export async function POST(req: Request) {
  const body = await req.json();

  const {
    restaurantSlug,
    items,
    orderNotes,
    tableNumber,
    orderType,
    customerName,
    customerPhone,
    deliveryAddress,
  } = body;

  const restaurant = await db.restaurant.findFirst({
    where: {
      slug: restaurantSlug,
      isActive: true,
    },
  });

  if (!restaurant) {
    return NextResponse.json({ error: "Restaurant not found" });
  }

  let subtotal = 0;

  for (const item of items) {
    subtotal += item.price * item.quantity;
  }

  const tax = 0;
  const discount = 0;
  const total = subtotal + tax - discount;

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const orderCode = await db.$transaction(async (tx) => {
    let counter = await tx.orderCounter.findUnique({
      where: {
        tenantId_restaurantId_date: {
          tenantId: restaurant.tenantId,
          restaurantId: restaurant.id,
          date: todayStart,
        },
      },
    });

    if (!counter) {
      counter = await tx.orderCounter.create({
        data: {
          tenantId: restaurant.tenantId,
          restaurantId: restaurant.id,
          date: todayStart,
          lastNumber: 1,
        },
      });

      return String(counter.lastNumber);
    }

    counter = await tx.orderCounter.update({
      where: {
        tenantId_restaurantId_date: {
          tenantId: restaurant.tenantId,
          restaurantId: restaurant.id,
          date: todayStart,
        },
      },
      data: {
        lastNumber: {
          increment: 1,
        },
      },
    });

    return String(counter.lastNumber);
  });

  const order = await db.order.create({
    data: {
      tenantId: restaurant.tenantId,
      restaurantId: restaurant.id,
      status: "PENDING",
      subtotal: new Prisma.Decimal(subtotal),
      tax: new Prisma.Decimal(tax),
      discount: new Prisma.Decimal(discount),
      total: new Prisma.Decimal(total),
      currency: "INR",
      notes: orderNotes || null,
      orderCode: orderCode,
      tableNumber: tableNumber || null,
      customerName: customerName || null,
      customerPhone: customerPhone || null,
      deliveryAddress: deliveryAddress || null,
      source: orderType,
      items: {
        create: items.map((item: any) => ({
          tenantId: restaurant.tenantId,
          menuItemId: item.id,
          name: item.name,
          unitPrice: new Prisma.Decimal(item.price),
          quantity: item.quantity,
          totalPrice: new Prisma.Decimal(
            item.price * item.quantity
          ),
          isJain: item.isJain || false,
          notes: item.notes || null,
        })),
      },
    },
  });

  return NextResponse.json({
    orderId: order.id,
  });
}