import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { verifyBearer } from "@/lib/firebaseAdmin";

type WishlistItem = {
    id: number;
    title: string;
    price: number;
    image: string;
};

// DELETE /api/wishlist/:id  -> returns { wishlist: [...] }
export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    // Await the params Promise to get the actual params object
    const { id } = await params;

    const authHeader = req.headers.get("authorization");
    const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : undefined;
    const decoded = await verifyBearer(token);
    if (!decoded) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const idNum = Number(id);
    if (Number.isNaN(idNum)) {
        return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("ecommerce");
    const col = db.collection("wishlists");

    const existing = await col.findOne<{ uid: string; items: WishlistItem[] }>({ uid: decoded.uid });
    const items = existing?.items ?? [];

    const newItems = items.filter((i) => i.id !== idNum);

    await col.updateOne(
        { uid: decoded.uid },
        { $set: { items: newItems } },
        { upsert: true }
    );

    return NextResponse.json({ wishlist: newItems });
}