// External Dependencies
import * as mongoDB from "mongodb";
import * as dotenv from "dotenv";

// Global Variables
// export const collections: { sessions?: mongoDB.Collection } = {};
export const collections: {
  sessions?: mongoDB.Collection;
  users?: mongoDB.Collection;
} = {};

// Initialize Connection
export async function connectToDatabase() {
  dotenv.config();

  if (!process.env?.DB_CONN_STRING) {
    throw new Error("Missing Connection string");
  }

  if (
    !process.env?.USERS_COLLECTION_NAME ||
    !process.env?.SESSIONS_COLLECTION_NAME
  ) {
    throw new Error("Missing Connection string and/or collection names");
  }
  const client: mongoDB.MongoClient = new mongoDB.MongoClient(
    process.env.DB_CONN_STRING
  );

  await client.connect();

  const db: mongoDB.Db = client.db(process.env.DB_NAME);

  const sessionsCollection: mongoDB.Collection = db.collection(
    process.env.SESSIONS_COLLECTION_NAME
  );
  const usersCollection: mongoDB.Collection = db.collection(
    process.env.USERS_COLLECTION_NAME
  );

  collections.users = usersCollection;
  collections.sessions = sessionsCollection;

  console.log(
    `Successfully connected to database: ${db.databaseName} and collection: ${sessionsCollection.collectionName}`
  );
}
