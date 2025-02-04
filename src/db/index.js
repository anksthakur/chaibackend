import mongoose from "mongoose";

// DB connection function
const dbConnect = async () => {
  try {
    const dbURI = "mongodb://localhost:27017/wetube";
    await mongoose.connect(dbURI);
    console.log("MongoDB connected with wetube");
  } catch (error) {
    console.log("MongoDB connection error:", error);
    throw error;
  }
};

export default dbConnect;
