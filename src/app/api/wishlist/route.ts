import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { verifyBearer } from "@/lib/firebaseAdmin";

type WishlistItem = {
    id: number;
    title: string;
    price: number;
    image: string;
};

// (optional) If your project isn’t globally node runtime, uncomment:
// export const runtime = "nodejs";

// GET /api/wishlist  -> returns { wishlist: [...] }
export async function GET(req: NextRequest) {
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : undefined;
    const decoded = await verifyBearer(token);
    if (!decoded) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const client = await clientPromise;
    const db = client.db("ecommerce");
    const col = db.collection("wishlists");

    // optional index for fast lookups & uniqueness (create once)
    // await col.createIndex({ uid: 1 }, { unique: true });

    const doc = await col.findOne<{ uid: string; items: WishlistItem[] }>({ uid: decoded.uid });
    return NextResponse.json({ wishlist: doc?.items ?? [] });
}

// POST /api/wishlist  -> body = WishlistItem; returns { wishlist: [...] }
export async function POST(req: NextRequest) {
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : undefined;
    const decoded = await verifyBearer(token);
    if (!decoded) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    let body: WishlistItem;
    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    if (
        typeof body?.id !== "number" ||
        typeof body?.title !== "string" ||
        typeof body?.price !== "number" ||
        typeof body?.image !== "string"
    ) {
        return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("ecommerce");
    const col = db.collection("wishlists");

    const existing = await col.findOne<{ uid: string; items: WishlistItem[] }>({ uid: decoded.uid });
    const items = existing?.items ?? [];

    // avoid duplicates by id
    if (!items.find((i) => i.id === body.id)) {
        items.push(body);
        await col.updateOne(
            { uid: decoded.uid },
            { $set: { items } },
            { upsert: true }
        );
    }

    return NextResponse.json({ wishlist: items });
}
