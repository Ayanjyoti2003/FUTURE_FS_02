// lib/mongodb.ts
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI!;
const options = {};

// ✅ Extend NodeJS.Global to avoid `any`
declare global {
    // allow global `var` in dev without TS errors
    // (must use `var` instead of `let/const` for reassigning in hot reload)
    // eslint-disable-next-line no-var
    var _mongoClientPromise: Promise<MongoClient> | undefined;
}

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (!process.env.MONGODB_URI) {
    throw new Error("Please add your Mongo URI to .env");
}

if (process.env.NODE_ENV === "development") {
    // Reuse global client in dev to prevent creating new connections
    if (!global._mongoClientPromise) {
        client = new MongoClient(uri, options);
        global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
} else {
    // In production, always create a new client
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
}

export default clientPromise;
