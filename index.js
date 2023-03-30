import * as dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import express from "express";
import connectToDB from "./config/connectToDb";
import sampleRoute from "./routes/sampleRoute";

const app = express();
const PORT = process.env.PORT || 5000;

//Connecting to database
connectToDB();

//Middleware
app.use(express.json());

//Routes
app.use("/sample", sampleRoute);

app.listen(PORT, () => {
  console.log("Server Running on port " + PORT);
});
