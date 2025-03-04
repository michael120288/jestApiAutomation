import { MongoClient, Db, ObjectId } from "mongodb";
const dotenv = require("dotenv");

dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL || "";

let client: MongoClient;
let db: Db;

export async function connectDB() {
  if (!client) {
    client = new MongoClient(DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as any);
    await client.connect();
    db = client.db();
  }
  return { client, db };
}

export async function closeDB() {
  if (client) {
    await client.close();
  }
}

export async function findUserByName(name: string) {
  const { db } = await connectDB();
  return await db.collection("users").findOne({ name });
}

export async function deleteUserById(userId: string) {
  const { db } = await connectDB();
  return await db.collection("users").deleteOne({ _id: new ObjectId(userId) });
}

export async function findTourByName(name: string) {
    const { db } = await connectDB();
    return await db.collection("tours").findOne({ name });
  }
  export async function deleteTourById(tourId: string) {
    const { db } = await connectDB();
    return await db.collection("tours").deleteOne({ _id: new ObjectId(tourId) });
  }
  export async function findTourById(tourId: string) {
    const { db } = await connectDB();
    return await db.collection("tours").findOne({ _id: new ObjectId(tourId) });
  }