import "dotenv/config";
import app from "./app";
import { connectDatabase } from "./config/database";

const startServer = async (): Promise<void> => {
  try {
    await connectDatabase();
    const port = process.env.PORT || 5000;
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
      console.log(`http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(1);
  }
};

startServer();
