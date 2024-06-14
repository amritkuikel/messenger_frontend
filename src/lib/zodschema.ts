import { z } from "zod";

export const signUpSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email().min(2).max(50),
  password: z.string().min(2).max(50),
});

export const loginSchema = z.object({
  email: z.string().email().min(2).max(50),
  password: z.string().min(2).max(50),
});

export const messageSchema = z.object({
  message: z.string().min(2).max(50)
});