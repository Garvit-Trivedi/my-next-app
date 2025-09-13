// src/app/api/companies/route.js
import clientPromise from "../mongodb/mongoClient";  

const dbName = "test";

// --------------------- GET ---------------------
export async function GET(req) {
  try {
    const client = await clientPromise;
    const db = client.db(dbName);
    const coll = db.collection("companies");

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit")) || 0;
    const page = parseInt(searchParams.get("page")) || 1;
    const skip = limit > 0 ? (page - 1) * limit : 0;

    const docs = await coll.find({})
      .skip(skip)
      .limit(limit)
      .toArray();

    const cleanDocs = docs.map(d => ({ ...d, _id: d._id.toString() }));

    return new Response(JSON.stringify(cleanDocs), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Error in GET /api/companies:", err);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// --------------------- POST ---------------------
export async function POST(req) {
  try {
    const client = await clientPromise;
    const db = client.db(dbName);
    const coll = db.collection("companies");

    const body = await req.json();

    if (!body.name || !body.location) {
      return new Response(JSON.stringify({ error: "Missing required fields: name, location" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const result = await coll.insertOne(body);

    return new Response(JSON.stringify({
      message: "Company inserted successfully",
      insertedId: result.insertedId.toString(),
    }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Error in POST /api/companies:", err);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}