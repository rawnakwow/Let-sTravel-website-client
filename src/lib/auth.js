import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { jwt } from "better-auth/plugins";
import { MongoClient } from "mongodb";

/* =====================================================
   MONGODB CLIENT
===================================================== */

const globalForMongo = globalThis;

const mongoClient =
  globalForMongo.letsTravelMongoClient ||
  new MongoClient(
    process.env.MONGODB_URI ||
      "mongodb://127.0.0.1:27017"
  );

if (process.env.NODE_ENV !== "production") {
  globalForMongo.letsTravelMongoClient =
    mongoClient;
}

/* =====================================================
   DATABASE
===================================================== */

const databaseName =
  process.env.DB_NAME || "jatrago";

const database =
  mongoClient.db(databaseName);

/* =====================================================
   APPLICATION URL
===================================================== */

const appURL =
  process.env.BETTER_AUTH_URL ||
  process.env.NEXT_PUBLIC_APP_URL ||
  "http://localhost:3000";

/* =====================================================
   TRUSTED ORIGINS
===================================================== */

const trustedOrigins = (
  process.env.BETTER_AUTH_TRUSTED_ORIGINS ||
  appURL
)
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

/* =====================================================
   GOOGLE AUTH
===================================================== */

const socialProviders =
  process.env.GOOGLE_CLIENT_ID &&
  process.env.GOOGLE_CLIENT_SECRET
    ? {
        google: {
          clientId:
            process.env.GOOGLE_CLIENT_ID,

          clientSecret:
            process.env
              .GOOGLE_CLIENT_SECRET,

          prompt: "select_account",
        },
      }
    : {};

/* =====================================================
   BETTER AUTH
===================================================== */

export const auth = betterAuth({
  appName: "Let'sTravel",

  /* -----------------------------
     BASE URL
  ----------------------------- */

  baseURL: appURL,

  /* -----------------------------
     AUTH SECRET
  ----------------------------- */

  secret: process.env.BETTER_AUTH_SECRET,

  /* -----------------------------
     TRUSTED ORIGINS
  ----------------------------- */

  trustedOrigins,

  /* -----------------------------
     DATABASE
  ----------------------------- */

  database: mongodbAdapter(
    database,
    {
      client: mongoClient,
    }
  ),

  /* -----------------------------
     EMAIL + PASSWORD
  ----------------------------- */

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    autoSignIn: true,
  },

  /* -----------------------------
     GOOGLE LOGIN
  ----------------------------- */

  socialProviders,

  /* -----------------------------
     ADDITIONAL USER FIELDS
  ----------------------------- */

  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "user",
        input: false,
      },

      isFraud: {
        type: "boolean",
        defaultValue: false,
        input: false,
      },
    },
  },

  /* -----------------------------
     SESSION
  ----------------------------- */

  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
      strategy: "jwt",
    },
  },

  /* -----------------------------
     JWT PLUGIN
  ----------------------------- */

  plugins: [
    jwt({
      sessionCookieCache: true,

      jwt: {
        issuer: appURL,
        audience: appURL,
        expirationTime: "1h",

        definePayload: ({ user }) => ({
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image || null,
          role: user.role || "user",
          isFraud:
            user.isFraud || false,
        }),
      },
    }),
  ],
});