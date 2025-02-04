import dotenv from "dotenv";
import dbConnect from "./db/index.js";
import { app } from './app.js';

dotenv.config({
    path: "./.env"
});

const PORT = process.env.PORT || 5001;

// Connect to the database and start the server
dbConnect()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to start server due to DB connection error", error);
    process.exit(1);
  });
