import clientPromise from "../../mongodb/mongoClient";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q");       // free-text query
    const skill = searchParams.get("skill"); // direct skill filter

    const client = await clientPromise;
    const db = client.db("test");
    const coll = db.collection("companies");

    const query = {};

    if (q) {
      // Regex search on name and hiringCriteria.skills
      query.$or = [
        { name: { $regex: new RegExp(q, "i") } },
        { "hiringCriteria.skills": { $regex: new RegExp(q, "i") } }
      ];
    }

    if (skill) {
      // Ensure skills array contains the skill
      query["hiringCriteria.skills"] = { $regex: new RegExp(skill, "i") };
    }

    const docs = await coll.find(query).toArray();

    const cleanDocs = docs.map(d => ({
      ...d,
      _id: d._id.toString()
    }));

    return new Response(JSON.stringify(cleanDocs), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (err) {
    console.error("Error in GET /api/companies/text-search:", err);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}