import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { verifyBearer } from "@/lib/firebaseAdmin";
import { ObjectId } from "mongodb";


type OrderItemIn = {
    id: number;
    title: string;
    price: number;
    image?: string;
    qty: number;
};

type ShippingInfo = {
    fullName: string;
    address1: string;
    city: string;
    country: string;
    zip: string;
    phone?: string;
};

// GET /api/orders -> list user's orders
export async function GET(req: NextRequest) {
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : undefined;
    const decoded = await verifyBearer(token);
    if (!decoded) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const client = await clientPromise;
    const db = client.db("ecommerce");

    await db.collection("orders").createIndex({ userUid: 1, createdAt: -1 });

    const orders = await db
        .collection("orders")
        .find({ userUid: decoded.uid })
        .sort({ createdAt: -1 })
        .toArray();

    return NextResponse.json(orders);
}

// POST /api/orders -> create order with PENDING status
export async function POST(req: NextRequest) {
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : undefined;
    const decoded = await verifyBearer(token);
    if (!decoded) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    let body: { items: OrderItemIn[]; shippingInfo: ShippingInfo };

    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const { items, shippingInfo } = body;

    if (!Array.isArray(items) || items.length === 0) {
        return NextResponse.json({ error: "Items required" }, { status: 400 });
    }
    for (const i of items) {
        if (
            typeof i?.id !== "number" ||
            typeof i?.title !== "string" ||
            typeof i?.price !== "number" ||
            typeof i?.qty !== "number" ||
            i.qty < 1
        ) {
            return NextResponse.json({ error: "Invalid item payload" }, { status: 400 });
        }
    }
    if (
        !shippingInfo ||
        !shippingInfo.fullName ||
        !shippingInfo.address1 ||
        !shippingInfo.city ||
        !shippingInfo.country ||
        !shippingInfo.zip
    ) {
        return NextResponse.json({ error: "Invalid shipping info" }, { status: 400 });
    }

    const toCents = (n: number) => Math.round(n * 100);
    const fromCents = (c: number) => c / 100;

    const subtotalCents = items.reduce((sum, i) => sum + toCents(i.price) * i.qty, 0);
    const shippingCents = toCents(10);
    const totalCents = subtotalCents + shippingCents;

    const client = await clientPromise;
    const db = client.db("ecommerce");

    const orderDoc = {
        userUid: decoded.uid,
        items: items.map((i) => ({
            productId: i.id,
            title: i.title,
            price: i.price,
            image: i.image ?? "",
            qty: i.qty,
            lineTotal: fromCents(toCents(i.price) * i.qty),
        })),
        subtotal: fromCents(subtotalCents),
        shipping: fromCents(shippingCents),
        total: fromCents(totalCents),
        status: "PENDING" as const, // now starts as PENDING
        shippingInfo,
        createdAt: new Date(),
    };

    const insertRes = await db.collection("orders").insertOne(orderDoc);

    await db.collection("carts").updateOne(
        { uid: decoded.uid },
        { $set: { items: [] } },
        { upsert: true }
    );

    return NextResponse.json({ ok: true, orderId: String(insertRes.insertedId) }, { status: 201 });
}

// PATCH /api/orders/:id -> update order status
export async function PATCH(req: NextRequest) {
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : undefined;
    const decoded = await verifyBearer(token);
    if (!decoded) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get("id");
    if (!orderId) {
        return NextResponse.json({ error: "Order ID required" }, { status: 400 });
    }

    let body: { status: string };
    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("ecommerce");

    const res = await db.collection("orders").updateOne(
        { _id: new ObjectId(orderId), userUid: decoded.uid },
        { $set: { status: body.status } }
    );

    if (res.matchedCount === 0) {
        return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
}
