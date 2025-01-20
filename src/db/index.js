import mongoose from "mongoose";
import express from "express";

const app = express();
const PORT = 5001;
const dbConnect = async () => {
  try {
    const dbURI = "mongodb://localhost:27017/crud";
    await mongoose.connect(dbURI);
    console.log("MongoDB connected crud");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.log("Mongo db connection :", error);
    process.exit(1);
  }
};
export default dbConnect;
