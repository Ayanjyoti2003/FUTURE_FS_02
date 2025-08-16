import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { verifyBearer } from "@/lib/firebaseAdmin";
import { ObjectId } from "mongodb";

// ✅ GET single order
export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : undefined;
    const decoded = await verifyBearer(token);
    if (!decoded) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const client = await clientPromise;
    const db = client.db("ecommerce");

    let _id: ObjectId;
    try {
        _id = new ObjectId(params.id);
    } catch {
        return NextResponse.json({ error: "Invalid order id" }, { status: 400 });
    }

    const order = await db.collection("orders").findOne({ _id, userUid: decoded.uid });
    if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json(order);
}

// ✅ PATCH to cancel order
export async function PATCH(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : undefined;
    const decoded = await verifyBearer(token);
    if (!decoded) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    let _id: ObjectId;
    try {
        _id = new ObjectId(params.id);
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

    // Only allow cancelling pending orders
    const result = await db.collection("orders").updateOne(
        { _id, userUid: decoded.uid, status: "PENDING" },
        { $set: { status: "CANCELLED", cancelledAt: new Date() } }
    );

    if (result.matchedCount === 0) {
        return NextResponse.json({ error: "Order not found or cannot be cancelled" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
}
