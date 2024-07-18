import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("Please add your Mongo URI to .env.local");
}

let client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let cachedClient = null;
let cachedDb = null;

async function connectMongo() {
  if (cachedDb) {
    return cachedDb;
  }

  if (!cachedClient) {
    cachedClient = await client.connect();
  }

  cachedDb = cachedClient.db('stock').collection('inventory');
  return cachedDb;
}

export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        const inventory = await connectMongo();
        const products = await inventory.find({}).toArray();
        res.status(200).json({ success: true, products });
      } catch (error) {
        console.error("GET Error:", error);
        res.status(500).json({ success: false, error: error.message });
      }
      break;

    case 'POST':
      try {
        const inventory = await connectMongo();
        const body = req.body; // Directly using req.body
        const product = await inventory.insertOne(body);
        res.status(200).json({ product, success: true });
      } catch (error) {
        console.error("POST Error:", error);
        res.status(500).json({ success: false, error: error.message });
      }
      break;

      case 'DELETE':
        try {
          const inventory = await connectMongo();
          const { id } = await req.json();
          const result = await inventory.deleteOne({ _id: new ObjectId(id) });
  
          if (result.deletedCount === 1) {
            res.status(200).json({ success: true });
          } else {
            res.status(404).json({ success: false, error: "Product not found" });
          }
        } catch (error) {
          console.error("DELETE Error:", error);
          res.status(500).json({ success: false, error: error.message });
        }
        break;
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
