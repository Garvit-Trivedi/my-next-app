import clientPromise from "../../../mongodb/mongoClient";
import { ObjectId } from "mongodb";

export async function PATCH(req, { params }) {
  try {
    const { id } = params;
    const newRound = await req.json();

    if (!newRound || !newRound.round || !newRound.type) {
      return new Response(
        JSON.stringify({ error: "Both round and type are required" }),
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("test");
    const companies = db.collection("companies");

    // Push new round
    const result = await companies.updateOne(
      { _id: new ObjectId(id) },
      { $push: { interviewRounds: newRound } }
    );

    return new Response(
      JSON.stringify({ message: "Interview round added", result }),
      { status: 200 }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500 }
    );
  }
}