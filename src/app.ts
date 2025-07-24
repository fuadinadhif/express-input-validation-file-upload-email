import express, { Application } from "express";

import authRoutes from "./routes/auth.route.js";

import { errorMiddleware } from "./middlewares/error.middleware.js";

const app: Application = express();

app.use(express.json());

app.use("/api/auth", authRoutes);

app.use(errorMiddleware);

const PORT: string = "8000";
app.listen(PORT, () => console.info(`Server is listening on port: ${PORT}`));
