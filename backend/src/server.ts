import { app } from "./app";
import { connectDatabase } from "./config/db";
import { env } from "./config/env";

// Bootstrap the backend server after successfully connecting to MongoDB.
async function bootstrap() {
  try {
    await connectDatabase();
    app.listen(env.PORT, () => {
      console.log(`Backend listening on http://localhost:${env.PORT}`);
    });
  } catch (error) {
    console.error("Failed to start backend", error);
    process.exit(1);
  }
}

void bootstrap();
