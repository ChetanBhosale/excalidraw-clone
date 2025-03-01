import express from "express";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

import authRoutes from "./routes/auth.routes";
app.use("/auth",authRoutes);

app.listen(8000, () => {
  console.log("Server is running on port 3000");
});