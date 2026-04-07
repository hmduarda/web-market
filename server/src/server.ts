import "dotenv/config";
import app from "./app";
import { connectDatabase } from "./config/database";

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`http://localhost:${port}`);
});

connectDatabase().catch((error) => {
  console.error("Error connecting to MongoDB:", error.message);
});