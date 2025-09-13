import clientPromise from "../../mongodb/mongoClient";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const location = searchParams.get("location");

    const client = await clientPromise;
    const db = client.db("test");
    const coll = db.collection("companies");

    let result;

    if (location) {
      // Count only for given location
      const count = await coll.countDocuments({ location: { $regex: new RegExp(location, "i") } });
      result = { location, count };
    } else {
      // Count all + group by location
      const total = await coll.countDocuments();
      const byLocation = await coll.aggregate([
        { $group: { _id: "$location", count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]).toArray();

      result = { total, byLocation };
    }

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (err) {
    console.error("Error in GET /api/companies/count:", err);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}