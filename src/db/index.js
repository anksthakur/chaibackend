import mongoose from "mongoose";
import express from "express";

const app = express();
const PORT = 5001;
const dbConnect = async () => {
  try {
    const dbURI = "mongodb://localhost:27017/wetube";
    await mongoose.connect(dbURI);
    console.log("MongoDB connected with wetube");
    app.listen(PORT || 8000, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.log("Mongo db connection error  :", error);
    process.exit(1);
  }
};
export default dbConnect;
