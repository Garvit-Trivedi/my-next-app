




// src/app/api/mongodb/route.js
import { MongoClient } from "mongodb";

const uri = "mongodb+srv://assignment:assignment@assignment.jtoji2z.mongodb.net/?retryWrites=true&w=majority&appName=assignment";
const client = new MongoClient(uri);

export async function GET() {
  try {
    await client.connect();
    const db = client.db("workbook"); // change "test" to your DB name
    const companies = await db.collection("companies").find({}).toArray();

    return new Response(JSON.stringify({ success: true, data: companies }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  } finally {
    await client.close();
  }
}

