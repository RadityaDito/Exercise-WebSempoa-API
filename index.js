import * as dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import express from "express";
import cors from "cors";
import connectToDB from "./config/connectToDb.js";
import sampleRoute from "./routes/sampleRoute.js";
import muridRoute from "./routes/muridRoute.js";

const app = express();
const PORT = process.env.PORT || 5000;

//Connecting to database
connectToDB();

//Middleware
app.use(express.json());
app.use(cors());

//Routes
app.use("/sample", sampleRoute);
app.use("/murid", muridRoute);

app.listen(PORT, () => {
  console.log("Server Running on port " + PORT);
});
