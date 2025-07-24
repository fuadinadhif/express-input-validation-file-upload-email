import { Request, Response, NextFunction } from "express";
import Handlebars from "handlebars";
import fs from "node:fs/promises";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { prisma } from "@/configs/prisma.config.js";
import { resend } from "@/configs/resend.config.js";
import { cloudinary } from "@/configs/cloudinary.config.js";

import { registerSchema, loginSchema } from "@/validations/auth.validation.js";

export async function register(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const file = request.file;
    const { firstName, lastName, email, password } = registerSchema.parse(
      request.body
    );

    if (!file) {
      return response
        .status(400)
        .json({ message: "Profile picture not found" });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) throw new Error("User already registered");

    const hashedPassword = await bcrypt.hash(password, 10);

    const uploadResult = await cloudinary.uploader.upload(file.path);
    await fs.unlink(file.path);

    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        profilePic: uploadResult.secure_url,
      },
    });

    const templatePath = "src/templates/emails/welcome.hbs";
    const templateSource = await fs.readFile(templatePath, "utf8");
    const template = Handlebars.compile(templateSource);
    const emailData = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    };
    const emailHtml = template(emailData);

    const { data, error } = await resend.emails.send({
      from: "Purwadhika <onboarding@resend.dev>",
      to: [user.email],
      subject: "Welcome to Purwadhika",
      html: emailHtml,
    });

    if (error) {
      return next(error);
    }

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
    const { email, password } = loginSchema.parse(request.body);

    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (
      !existingUser ||
      !(await bcrypt.compare(password, existingUser.password))
    ) {
      throw new Error("Invalid email or password");
    }

    const payload = {
      id: existingUser.id,
      email: existingUser.email,
      firstName: existingUser.firstName,
      lastName: existingUser.lastName,
      profilePic: existingUser.profilePic,
    };
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET as string, {
      expiresIn: "1h",
    });

    response.status(200).json({ message: "Login success", accessToken });
  } catch (error) {
    next(error);
  }
}
