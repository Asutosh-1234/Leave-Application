import express from "express";
import cors from "cors"
import "dotenv/config";
import healthCheck  from "./routers/healthCheck.router.js";

const app = express()

app.use(express.json())
app.use(cors())


app.use("/",healthCheck)

export default app;
