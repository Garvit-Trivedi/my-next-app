import clientPromise from "../../mongodb/mongoClient";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const city = searchParams.get("city");
    const minBase = searchParams.get("minBase");
    const skill = searchParams.get("skill");

    const client = await clientPromise;
    const db = client.db("test");
    const coll = db.collection("companies");

    const query = {};
    if (city) query.location = { $regex: new RegExp(city, "i") };

    if (minBase) {
      query["salaryBand.base"] = { $gte: Number(minBase) }; // force numeric
    }

   if (skill) query["hiringCriteria.skills"] = { $regex: new RegExp(skill, "i") };



    const docs = await coll.find(query).toArray();

    const cleanDocs = docs.map((d) => ({
      ...d,
      _id: d._id.toString(),
    }));

    return new Response(JSON.stringify(cleanDocs), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Error in GET /api/companies/search:", err);
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}