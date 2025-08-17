// app/api/orders/[id]/route.ts
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { verifyBearer } from "@/lib/firebaseAdmin";
import { ObjectId } from "mongodb";

// ✅ Explicit context type for dynamic routes
type RouteContext = {
    params: { id: string };
};

// ✅ GET single order
export async function GET(req: Request, context: RouteContext) {
    const { id } = context.params;

    const authHeader = req.headers.get("authorization");
    const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : undefined;
    const decoded = await verifyBearer(token);
    if (!decoded) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const client = await clientPromise;
    const db = client.db("ecommerce");

    let _id: ObjectId;
    try {
        _id = new ObjectId(id);
    } catch {
        return NextResponse.json({ error: "Invalid order id" }, { status: 400 });
    }

    const order = await db.collection("orders").findOne({ _id, userUid: decoded.uid });
    if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json({ ...order, _id: order._id.toString() });
}

// ✅ PATCH → cancel order
export async function PATCH(req: Request, context: RouteContext) {
    const { id } = context.params;

    const authHeader = req.headers.get("authorization");
    const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : undefined;
    const decoded = await verifyBearer(token);
    if (!decoded) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    let _id: ObjectId;
    try {
        _id = new ObjectId(id);
    } catch {
        return NextResponse.json({ error: "Invalid order id" }, { status: 400 });
    }

    let body: { status?: string };
    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    if (body.status !== "CANCELLED") {
        return NextResponse.json({ error: "Invalid status value" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("ecommerce");

    const result = await db.collection("orders").updateOne(
        { _id, userUid: decoded.uid, status: "PENDING" },
        { $set: { status: "CANCELLED", cancelledAt: new Date() } }
    );

    if (result.matchedCount === 0) {
        return NextResponse.json({ error: "Order not found or cannot be cancelled" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
}
