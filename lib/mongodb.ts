import dns from 'node:dns'
import { MongoClient, type Db } from 'mongodb'

const uri = process.env.MONGODB_URI
const dbName = process.env.MONGODB_DB || 'portfolio'

// Optional DNS override for networks whose resolver refuses MongoDB SRV
// lookups. Applied in the same process that opens the connection.
if (process.env.DNS_SERVERS) {
  const servers = process.env.DNS_SERVERS.split(',').map((s) => s.trim()).filter(Boolean)
  if (servers.length) dns.setServers(servers)
}

let clientPromise: Promise<MongoClient> | null = null

// Reuse the connection across hot-reloads / serverless invocations.
const globalForMongo = globalThis as unknown as {
  _mongoClientPromise?: Promise<MongoClient>
}

export function isDbConfigured() {
  return Boolean(uri)
}

export async function getDb(): Promise<Db> {
  if (!uri) {
    throw new Error('MONGODB_URI is not set. Add it to your environment variables.')
  }
  if (!clientPromise) {
    if (!globalForMongo._mongoClientPromise) {
      const client = new MongoClient(uri)
      globalForMongo._mongoClientPromise = client.connect()
    }
    clientPromise = globalForMongo._mongoClientPromise
  }
  const client = await clientPromise
  return client.db(dbName)
}
