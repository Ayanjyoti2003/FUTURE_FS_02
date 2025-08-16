// pages/api/profile.ts
import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "@/lib/mongodb";
import admin from "@/lib/firebaseAdmin"; // Firebase Admin SDK

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const client = await clientPromise;
        const db = client.db("shop");

        // 🔹 Verify Firebase token
        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith("Bearer ")) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const token = authHeader.split(" ")[1];
        const decoded = await admin.auth().verifyIdToken(token);
        const userId = decoded.uid;

        if (req.method === "GET") {
            const profile = await db.collection("profiles").findOne({ userId });
            return res.status(200).json(profile || {});
        }

        if (req.method === "POST") {
            const { name, photo } = req.body;
            await db.collection("profiles").updateOne(
                { userId },
                { $set: { name, photo } },
                { upsert: true }
            );
            return res.status(200).json({ success: true });
        }

        return res.status(405).end();
    } catch (error) {
        console.error("Profile API error:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}
