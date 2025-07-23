import express, { Application, NextFunction, Request, Response } from "express";

import authRoutes from "./routes/auth.route.js";

const app: Application = express();

app.use(express.json());

app.use("/api/auth", authRoutes);

app.use(
  (error: Error, request: Request, response: Response, next: NextFunction) => {
    console.error(error);

    response
      .status(500)
      .json({ message: error.message || "Unknown error", error });
  }
);

const PORT: string = "8000";
app.listen(PORT, () => console.info(`Server is listening on port: ${PORT}`));
