import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { verifyBearer } from "@/lib/firebaseAdmin";

export async function POST(req: NextRequest) {
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : undefined;
    const decoded = await verifyBearer(token);

    if (!decoded) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db("ecommerce");

    // Ensure user profile exists
    await db.collection("users").updateOne(
        { uid: decoded.uid },
        {
            $setOnInsert: {
                uid: decoded.uid,
                email: decoded.email,
                displayName: decoded.name || decoded.displayName || "",
                photoURL: decoded.picture || "",
                createdAt: new Date(),
            },
        },
        { upsert: true }
    );

    // Ensure empty cart exists
    await db.collection("carts").updateOne(
        { uid: decoded.uid },
        { $setOnInsert: { uid: decoded.uid, items: [] } },
        { upsert: true }
    );

    return NextResponse.json({ success: true });
}

