import clientPromise from "../../../mongodb/mongoClient";
import { ObjectId } from "mongodb";

export async function PATCH(req, { params }) {
  try {
    const { id } = params;
    const { benefit } = await req.json();

    if (!benefit) {
      return new Response(
        JSON.stringify({ error: "Benefit is required" }),
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("test"); // change to your DB name
    const companies = db.collection("companies");

    // Add benefit (avoid duplicates with $addToSet)
    const result = await companies.updateOne(
      { _id: new ObjectId(id) },
      { $addToSet: { benefits: benefit } }
    );

    return new Response(
      JSON.stringify({ message: "Benefit added", result }),
      { status: 200 }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500 }
    );
  }
}