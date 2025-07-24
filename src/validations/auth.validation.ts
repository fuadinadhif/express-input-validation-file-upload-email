import { z } from "zod";

export const registerSchema = z.object({
  firstName: z.string({
    error: "First name is required.",
  }),
  lastName: z.string({
    error: "Last name is required.",
  }),
  email: z.email("Invalid email format."),
  password: z
    .string({ error: "Password is required." })
    .min(3, "Password must be at least 3 characters long.")
    .regex(/[a-z]/, "Password must include at least one lowercase letter.")
    .regex(/[A-Z]/, "Password must include at least one uppercase letter.")
    .regex(/\d/, "Password must include at least one number.")
    .regex(
      /[^A-Za-z\d]/,
      "Password must include at least one special character."
    ),
});

export const loginSchema = z.object({
  email: z.email("Invalid email format"),
  password: z.string({ error: "Password is required" }),
});
