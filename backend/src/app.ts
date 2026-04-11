import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import routes from "./modules";
import { env } from "./config/env";
import { errorHandler } from "./middleware/error-handler";
import { notFoundHandler } from "./middleware/not-found";

export const app = express();

// Configure CORS to allow only trusted origins and support credentials.
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || env.CORS_ORIGINS.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
  }),
);

// Add standard security and logging middleware.
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

// Mount the application API routes and global handlers.
app.use("/api", routes);
app.use(notFoundHandler);
app.use(errorHandler);
