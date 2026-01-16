import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import nodeRoutes from "./routes/nodeRoutes.js";
import { connectDB } from "./config/db.js";
import rateLimiter from "./middleware/rateLimiter.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;


// middleware to parse JSON request bodies
app.use(cors({
  origin: "http://localhost:5173", // Adjust this to your frontend's origin
  methods: ["GET", "POST", "PUT", "DELETE"],
  // credentials: true,
}));

app.use(express.json());

app.use(rateLimiter);

app.use("/api/notes", nodeRoutes);

// Connect to the database and then start the server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server started on PORT: ${PORT}`);
  });
});

// connectDB();
// app.listen(PORT, () => {
//   console.log(`Server started on PORT: ${PORT}`);
// });

