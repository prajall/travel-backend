import app from "./app.ts";
import { connectDB, disconnectDB } from "./db/db.ts";

const PORT = process.env.PORT || 8000;

const startServer = async () => {
  try {
    const server = app.listen(PORT, () => {
      console.log(`Server running on PORT: ${PORT}`);
    });
    await connectDB();

    // Graceful Shutdown Handling
    process.on("SIGINT", async () => {
      console.log("Shutting down server...");
      await disconnectDB();
      server.close(() => {
        console.log("Server closed.");
        process.exit(0);
      });
    });
  } catch (error) {
    console.error("❌ Error starting server:", error);
    process.exit(1);
  }
};

startServer();
