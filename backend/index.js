//! create an express server and check if it's working

import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";

import aiRoutes from "./routes/ai-route.js";
import userRoutes from "./routes/auth-route.js";
import sessionRoutes from "./routes/session-route.js";

dotenv.config({ path: "./.env" });

const app = express();

const allowedOrigins = [
  process.env.CLIENT_URL,
  process.env.CLIENT_URL_PREVIEW,
  process.env.CLIENT_URL_PRODUCTION,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error(`Origin not allowed by CORS: ${origin}`));
    },
  }),
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

let isDatabaseConnected = false;

const connectDatabase = async () => {
  if (isDatabaseConnected) {
    return;
  }

  await mongoose.connect(process.env.MONGO_URI);
  isDatabaseConnected = true;
  console.log("MongoDB connected");
};

app.use(async (_req, _res, next) => {
  try {
    await connectDatabase();
    next();
  } catch (error) {
    next(error);
  }
});

app.get("/", (_req, res) => {
  res.status(200).json({ success: true, message: "Backend is running" });
});

app.use("/api/auth", userRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/ai", aiRoutes);

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({
    success: false,
    message: error.message || "Internal server error",
  });
});

export default app;

const PORT = process.env.PORT || 9001;

if (process.env.VERCEL !== "1") {
  connectDatabase()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`Server started on port ${PORT}`);
      });
    })
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}
