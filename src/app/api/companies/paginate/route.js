import clientPromise from "../../mongodb/mongoClient";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;

    const client = await clientPromise;
    const db = client.db("test");
    const coll = db.collection("companies");

    const skip = (page - 1) * limit;

    const docs = await coll.find({})
      .skip(skip)
      .limit(limit)
      .toArray();

    const totalDocs = await coll.countDocuments();

    const cleanDocs = docs.map(d => ({ ...d, _id: d._id.toString() }));

    return new Response(JSON.stringify({
      page,
      limit,
      totalDocs,
      totalPages: Math.ceil(totalDocs / limit),
      data: cleanDocs
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (err) {
    console.error("Error in GET /api/companies/paginate:", err);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}