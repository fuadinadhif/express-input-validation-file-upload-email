import express, { Application } from "express";

import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";

import { errorMiddleware } from "./middlewares/error.middleware.js";
import logger from "./utils/logger.js";

const app: Application = express();

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

app.use(errorMiddleware);

const PORT: string = "8000";
app.listen(PORT, () => logger.info(`Server is listening on port: ${PORT}`));
