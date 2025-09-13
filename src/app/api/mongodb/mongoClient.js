// src/app/api/mongodb/mongoClient.js
import { MongoClient } from "mongodb";

const uri =  "mongodb+srv://assignment:assignment@assignment.jtoji2z.mongodb.net/?retryWrites=true&w=majority&appName=assignment";
const options = {};

let client;
let clientPromise;

if (!global._mongoClientPromise) {
  client = new MongoClient(uri, options);
  global._mongoClientPromise = client.connect();
}

clientPromise = global._mongoClientPromise;

export default clientPromise;