import { z } from "zod";
export const Register = z
  .object({
    username: z.string().min(4),
    email: z.string().email(),
    phoneNumber: z.string(),
    password: z.string().min(4),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must much",
    path: ["confirmPassword"],
  });

export const Login = z.object({
  identifier: z.string().min(1, { message: "Identifier required" }),
  password: z.string().min(4, { message: "Password required" }),
});

export const OauthAuthSchema = z.object({
  providerAccountId: z.string(),
  name: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().email().optional(),
  image: z.string().optional(),
  type: z.enum(["google", "apple"]),
  provider: z.string(),
});

export const UserFilterSchema = z.object({
  search: z.string().optional(),
});

export const UserSchema = z
  .object({
    username: z
      .string()
      .min(4, { message: "Username must be at least 4 characters long" }),
    isAdmin: z.boolean().optional(),
    password: z
      .string()
      .min(4, { message: "Password must be at least 4 characters long" }),
    confirmPassword: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must much",
    path: ["confirmPassword"],
  });

export const PersonSchema = z.object({
  firstName: z.string().nonempty(),
  lastName: z.string().nonempty(),
  surname: z.string().optional(),
  email: z.string().email(),
  phoneNumber: z.string(),
  avatarUrl: z.string().optional(),
  gender: z.enum(["Male", "Female", "Unknown"]).optional(),
  userId: z.string().nonempty().uuid().optional(),
  user: UserSchema.optional(),
  userLinkStrategy: z.enum(["new", "existing"]).optional(),
});

export const PersonFilterSchema = z.object({
  search: z.string().optional(),
  userId: z.string().optional(),
});

export const PersonUpdateschema = PersonSchema.omit({
  user: true,
  userLinkStrategy: true,
  userId: true,
}).extend({
  username: z
    .string()
    .min(4, { message: "Username must be at least 4 characters long" }),
});

export const PersonUserLinkSchema = z.object({
  userId: z.string().nonempty().uuid(),
});
