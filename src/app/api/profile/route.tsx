import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import admin from "@/lib/firebaseAdmin"; // Firebase Admin SDK

// Handle GET (fetch profile)
export async function GET(req: NextRequest) {
    try {
        const client = await clientPromise;
        const db = client.db("shop");

        // 🔹 Verify Firebase token
        const authHeader = req.headers.get("authorization");
        if (!authHeader?.startsWith("Bearer ")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const token = authHeader.split(" ")[1];
        const decoded = await admin.auth().verifyIdToken(token);
        const userId = decoded.uid;

        const profile = await db.collection("profiles").findOne({ userId });
        return NextResponse.json(profile || {});
    } catch (error) {
        console.error("Profile API error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

// Handle POST (update profile)
export async function POST(req: NextRequest) {
    try {
        const client = await clientPromise;
        const db = client.db("shop");

        const authHeader = req.headers.get("authorization");
        if (!authHeader?.startsWith("Bearer ")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const token = authHeader.split(" ")[1];
        const decoded = await admin.auth().verifyIdToken(token);
        const userId = decoded.uid;

        const { name, photo } = await req.json();

        await db.collection("profiles").updateOne(
            { userId },
            { $set: { name, photo } },
            { upsert: true }
        );

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Profile API error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
