require('dotenv').config();
const { MongoClient } = require('mongodb');

(async () => {
  const url = process.env.ATLASDB_URL;
  if (!url) {
    console.error("ATLASDB_URL not set in .env");
    process.exit(1);
  }
  const client = new MongoClient(url);
  try {
    await client.connect();
    const db = client.db(); // uses DB in connection string
    const col = db.collection('sessions');
    const result = await col.deleteMany({});
    console.log(`Deleted ${result.deletedCount} documents from 'sessions' collection.`);
  } catch (err) {
    console.error("Error clearing sessions:", err);
  } finally {
    await client.close();
    process.exit(0);
  }
})();