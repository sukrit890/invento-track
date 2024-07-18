import { MongoClient } from "mongodb";


export default async function handler(req, res) {
  const { query } = req.query;
// Replace the uri string with your connection string.
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri); 
  try {
    const database = client.db('stock');
    const inventory = database.collection('inventory');

    // Perform aggregation query
    const products = await inventory.aggregate([
      {
        $match: {
          $or: [
            { slug: { $regex: query, $options: "i" } }, // Partial matching for slug field
            // Add additional matching conditions as needed
          ]
        }
      }
    ]).toArray();

    res.status(200).json({ success: true, products });
  } catch (error) {
    console.error("Error in search API:", error);
    res.status(500).json({ success: false, error: error.message });
  }
}
 
    
    
