import dotenv from "dotenv";
import app from "./app";
dotenv.config();

console.log("Environment check:");
console.log("- NODE_ENV:", process.env.NODE_ENV);
console.log("- PORT:", process.env.PORT);
console.log("- MONGO_URL configured:", !!process.env.MONGO_URL);

const PORT = process.env.PORT || 8000;

//dbc connection
import { connectDB } from "./config/dbConfig";

console.log("Connecting to Database...");
connectDB();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
