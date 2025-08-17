// lib/mongodb.ts
import { MongoClient, MongoClientOptions } from "mongodb";

const uri = process.env.MONGODB_URI!;
const options: MongoClientOptions = {};

// ✅ Extend NodeJS.Global to avoid `any` on hot reload
declare global {
    // eslint-disable-next-line no-var
    var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (!process.env.MONGODB_URI) {
    throw new Error("Please add your Mongo URI to .env");
}

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
    // Reuse the same connection during hot-reload in dev
    if (!globalThis._mongoClientPromise) {
        client = new MongoClient(uri, options);
        globalThis._mongoClientPromise = client.connect();
    }
    clientPromise = globalThis._mongoClientPromise!;
} else {
    // Always create new client in production
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
}

export default clientPromise;
