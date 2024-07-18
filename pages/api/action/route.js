import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return NextResponse.json({ success: false, message: 'Method Not Allowed' });
  }

  const uri = "mongodb+srv://sukritp2004:bobo@cluster0.bd48bly.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
  const client = new MongoClient(uri);
  
  try {
    const { action, slug, initialQuantity } = req.body;
    const database = client.db('stock');
    const inventory = database.collection('inventory');

    if (action === "del") {
      const filter = { slug: slug };
      const result = await inventory.deleteOne(filter);

      if (result.deletedCount === 1) {
        res.status(200).json({
          success: true,
          message: `Deleted document with name ${slug}`
        });
      } else {
        res.status(404).json({
          success: false,
          message: `No document found with name ${slug}`
        });
      }
    } else {
      let newQuantity = action === "plus" ? (parseInt(initialQuantity) + 1) : (parseInt(initialQuantity) - 1);

      const filter = { slug: slug };
      const updateDoc = {
        $set: {
          quantity: newQuantity
        }
      };

      const result = await inventory.updateOne(filter, updateDoc);

      if (result.matchedCount === 1) {
        res.status(200).json({
          success: true,
          message: `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`
        });
      } else {
        res.status(404).json({
          success: false,
          message: `No document found with slug ${slug}`
        });
      }
    }
  } catch (error) {
    console.error("Error updating quantity or deleting document:", error);
    res.status(500).json({ success: false, message: "Some error occurred" });
  } finally {
    await client.close();
  }
}
