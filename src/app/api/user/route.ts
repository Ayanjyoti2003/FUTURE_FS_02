import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { verifyBearer } from "@/lib/firebaseAdmin";

// GET profile
export async function GET(req: NextRequest) {
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : undefined;
    const decoded = await verifyBearer(token);

    if (!decoded) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db("ecommerce");
    const user = await db.collection("users").findOne({ uid: decoded.uid });

    return NextResponse.json(user ?? {});
}

// POST profile (create/update)
export async function POST(req: NextRequest) {
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : undefined;
    const decoded = await verifyBearer(token);

    if (!decoded) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const client = await clientPromise;
    const db = client.db("ecommerce");

    await db.collection("users").updateOne(
        { uid: decoded.uid },
        { $set: { ...body, uid: decoded.uid, email: decoded.email } },
        { upsert: true }
    );

    return NextResponse.json({ success: true });
}
