import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { jwt } from "better-auth/plugins";
import { MongoClient } from "mongodb";

const globalForMongo = globalThis;
const mongoClient = globalForMongo.jatragoMongoClient || new MongoClient(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017");
if (process.env.NODE_ENV !== "production") globalForMongo.jatragoMongoClient = mongoClient;

const databaseName = process.env.DB_NAME || "jatrago";
const appURL = process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
const trustedOrigins = (process.env.BETTER_AUTH_TRUSTED_ORIGINS || appURL)
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const socialProviders = process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET ? {
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    prompt: "select_account",
  },
} : {};

export const auth = betterAuth({
  appName: "Let'sTravel",
  baseURL: appURL,
  secret: process.env.BETTER_AUTH_SECRET,
  trustedOrigins,
  database: mongodbAdapter(mongoClient.db(databaseName), { client: mongoClient }),
  emailAndPassword: { enabled: true, minPasswordLength: 8, autoSignIn: true },
  socialProviders,
  user: {
    additionalFields: {
      role: { type: "string", defaultValue: "user", input: false },
      isFraud: { type: "boolean", defaultValue: false, input: false },
    },
  },
  session: { cookieCache: { enabled: true, maxAge: 5 * 60, strategy: "jwt" } },
  plugins: [jwt({
    sessionCookieCache: true,
    jwt: {
      issuer: appURL,
      audience: appURL,
      expirationTime: "1h",
      definePayload: ({ user }) => ({
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image,
        role: user.role || "user",
      }),
    },
  })],
});
