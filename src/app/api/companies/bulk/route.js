import clientPromise from "../../mongodb/mongoClient";

export async function POST(req) {
  try {
    const body = await req.json();

    if (!Array.isArray(body) || body.length === 0) {
      return new Response(
        JSON.stringify({ error: "Request body must be a non-empty JSON array" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const client = await clientPromise;
    const db = client.db("test");
    const coll = db.collection("companies");

    const result = await coll.insertMany(body);

    return new Response(
      JSON.stringify({
        message: "Companies inserted successfully",
        insertedCount: result.insertedCount,
        insertedIds: Object.values(result.insertedIds).map(id => id.toString())
      }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );

  } catch (err) {
    console.error("Error in POST /api/companies/bulk:", err);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}