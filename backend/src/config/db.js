import mongoose from "mongoose";
import dns from "node:dns";

const DEFAULT_DNS_SERVERS = ["8.8.8.8", "1.1.1.1"];

const configureMongoDns = (mongoUri) => {
  if (!mongoUri?.startsWith("mongodb+srv://")) {
    return;
  }

  const dnsServers = process.env.MONGO_DNS_SERVERS
    ? process.env.MONGO_DNS_SERVERS.split(",").map((server) => server.trim()).filter(Boolean)
    : DEFAULT_DNS_SERVERS;

  dns.setServers(dnsServers);
};

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is missing from environment variables");
    }

    configureMongoDns(process.env.MONGO_URI);

    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("Database connection failed:", error.message);

    if (error.message?.includes("querySrv")) {
      console.error(
        "MongoDB SRV DNS lookup failed. Check your internet/DNS, or set MONGO_DNS_SERVERS=8.8.8.8,1.1.1.1 in backend/.env."
      );
    }

    process.exit(1);
  }
};

export default connectDB;
