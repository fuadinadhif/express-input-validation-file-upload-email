import { Request, Response, NextFunction } from "express";
import { faker } from "@faker-js/faker";

import { prisma } from "@/configs/prisma.config.js";

export async function register(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { firstName, lastName, email, password, profilePic } = request.body;

    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password,
        profilePic: profilePic || faker.image.avatar(),
      },
    });

    response.status(201).json({ message: "User created", user });
  } catch (error) {
    next(error);
  }
}

export async function login(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { email, password } = request.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (!existingUser || existingUser?.password !== password) {
      return response
        .status(400)
        .json({ message: "Invalid email or password" });
    }

    response.status(200).json({ message: "Login success" });
  } catch (error) {
    next(error);
  }
}
