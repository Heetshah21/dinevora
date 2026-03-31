import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { Prisma, OrderSource } from "@prisma/client";

export async function POST(req: Request) {
  try {
    console.log("=== PLACE ORDER START ===");

    const body = await req.json();
    console.log("REQUEST BODY:", body);

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

    console.log("Restaurant Slug:", restaurantSlug);
    console.log("Items:", items);

    // Find restaurant
    const restaurant = await db.restaurant.findFirst({
      where: {
        slug: restaurantSlug,
        isActive: true,
      },
    });

    console.log("Restaurant Found:", restaurant);

    if (!restaurant) {
      console.log("Restaurant not found");
      return NextResponse.json({ error: "Restaurant not found" });
    }

    // Determine order source
    let source: OrderSource = "TAKEAWAY";

    if (tableNumber) {
      source = "IN_STORE";
    } else if (orderType === "DELIVERY") {
      source = "DELIVERY";
    } else {
      source = "TAKEAWAY";
    }

    console.log("Order Source:", source);

    // Calculate totals
    let subtotal = 0;
    for (const item of items) {
      subtotal += item.price * item.quantity;
    }

    const tax = 0;
    const discount = 0;
    const total = subtotal + tax - discount;

    console.log("Subtotal:", subtotal);
    console.log("Total:", total);

    // Start of day for order counter
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    todayStart.setMilliseconds(0);

    console.log("Today Start:", todayStart);

    // Generate order code
    const orderCode = await db.$transaction(async (tx) => {
      console.log("Inside transaction");

      let counter = await tx.orderCounter.findUnique({
        where: {
          tenantId_restaurantId_date: {
            tenantId: restaurant.tenantId,
            restaurantId: restaurant.id,
            date: todayStart,
          },
        },
      });

      console.log("Existing Counter:", counter);

      if (!counter) {
        console.log("Creating new counter");

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

      console.log("Updating counter");

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

    console.log("Order Code:", orderCode);

    // Create order
    const order = await db.order.create({
      data: {
        tenantId: restaurant.tenantId,
        restaurantId: restaurant.id,
        status: "PENDING",
        subtotal: subtotal,
        tax: tax,
        discount: discount,
        total: total,
        currency: "INR",
        notes: orderNotes || null,
        orderCode: orderCode,
        tableNumber: tableNumber || null,
        customerName: customerName || null,
        customerPhone: customerPhone || null,
        deliveryAddress: deliveryAddress || null,
        source: source,
        items: {
          create: items.map((item: any) => ({
            tenantId: restaurant.tenantId,
            menuItemId: item.id,
            name: item.name,
            unitPrice: item.price,
            quantity: item.quantity,
            totalPrice: item.price * item.quantity,
            isJain: item.isJain || false,
            notes: item.notes || null,
          })),
        },
      },
    });

    console.log("Order Created:", order.id);
    console.log("=== PLACE ORDER SUCCESS ===");

    return NextResponse.json({
      orderId: order.id,
    });

  } catch (error) {
    console.error("=== PLACE ORDER ERROR ===");
    console.error(error);

    return NextResponse.json({
      error: "Failed to place order",
    });
  }
}