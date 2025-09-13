import clientPromise from "../../mongodb/mongoClient";
import { ObjectId } from "mongodb";

// Helper to build a safe query
function buildIdQuery(id) {
  // If it's a valid 24-char hex string, treat as ObjectId
  if (/^[0-9a-fA-F]{24}$/.test(id)) {
    return { _id: new ObjectId(id) };
  }
  // Otherwise, fallback to raw string
  return { _id: id };
}

// --------------------- GET ---------------------
export async function GET(req, { params }) {
  try {
    const { id } = await params; // ✅ must await
    const client = await clientPromise;
    const db = client.db("test");
    const coll = db.collection("companies");

    const doc = await coll.findOne(buildIdQuery(id));

    if (!doc) {
      return new Response(JSON.stringify({ error: "Company not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({ ...doc, _id: doc._id.toString() }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    console.error("Error in GET /api/companies/[id]:", err);
    return new Response(
      JSON.stringify({ error: "Invalid ID or server error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

// --------------------- PUT ---------------------
export async function PUT(req, { params }) {
  try {
    const { id } = await params; // ✅ must await
    const updates = await req.json();

    const client = await clientPromise;
    const db = client.db("test");
    const coll = db.collection("companies");

    const result = await coll.updateOne(buildIdQuery(id), { $set: updates });

    if (result.matchedCount === 0) {
      return new Response(JSON.stringify({ error: "Company not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({ message: "Company updated successfully" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    console.error("Error in PUT /api/companies/[id]:", err);
    return new Response(
      JSON.stringify({ error: "Invalid ID or server error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

// --------------------- DELETE ---------------------
export async function DELETE(req, { params }) {
  try {
    const { id } = await params; // ✅ must await

    const client = await clientPromise;
    const db = client.db("test");
    const coll = db.collection("companies");

    const result = await coll.deleteOne(buildIdQuery(id));

    if (result.deletedCount === 0) {
      return new Response(JSON.stringify({ error: "Company not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({ message: "Company deleted successfully" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    console.error("Error in DELETE /api/companies/[id]:", err);
    return new Response(
      JSON.stringify({ error: "Invalid ID or server error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
