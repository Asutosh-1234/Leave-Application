import express from "express";
import cors from "cors"
import "dotenv/config";
import healthCheck  from "./routers/healthCheck.router.js";
import authRouter from "./routers/auth.router.js";
import { ApiError } from "./utilities/api-error.js";

const app = express()

app.use(express.json())
app.use(cors())


app.use("/",healthCheck)
app.use("/api/v1/auth", authRouter)

// Global Error Handler
app.use((err, req, res, next) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: err.success,
      message: err.message,
      errors: err.errors,
      data: err.data
    });
  }
  
  console.error(err);
  return res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error"
  });
});

export default app;
