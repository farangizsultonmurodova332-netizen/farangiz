import { z } from "zod";

// Auth schemas
export const registerSchema = z.object({
  username: z
    .string()
    .min(1, "Username is required")
    .min(3, "Username must be at least 3 characters")
    .max(150, "Username must be at most 150 characters")
    .regex(
      /^[\w.@+-]+$/,
      "Username can only contain letters, numbers, and @/./+/-/_ characters"
    )
    .refine((val) => val.trim().length >= 3, {
      message: "Username must be at least 3 characters (excluding whitespace)",
    }),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email address")
    .max(254, "Email must be at most 254 characters"),
  phone: z.string().min(1, "Phone is required"),
  location: z.string().min(1, "Location is required"),
  portfolio_file: z
    .custom<FileList>((value) => value instanceof FileList, {
      message: "Portfolio is required",
    })
    .refine((files) => files.length > 0, "Portfolio is required"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password must be at most 128 characters")
    .refine((val) => val.trim().length > 0, {
      message: "Password cannot be only whitespace",
    }),
  bio: z.string().max(500, "Bio must be at most 500 characters").optional(),
});

export const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

// Idea schemas
export const ideaSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(120, "Title must be at most 120 characters")
    .refine((val) => val.trim().length > 0, {
      message: "Title cannot be only whitespace",
    }),
  short_description: z
    .string()
    .min(1, "Short description is required")
    .max(280, "Short description must be at most 280 characters")
    .refine((val) => val.trim().length > 0, {
      message: "Short description cannot be only whitespace",
    }),
  full_description: z
    .string()
    .min(1, "Full description is required")
    .max(5000, "Full description must be at most 5000 characters")
    .refine((val) => val.trim().length > 0, {
      message: "Full description cannot be only whitespace",
    }),
  category: z
    .string()
    .min(1, "Category is required")
    .max(80, "Category must be at most 80 characters")
    .refine((val) => val.trim().length > 0, {
      message: "Category cannot be only whitespace",
    }),
  tags: z
    .array(
      z
        .string()
        .min(1, "Tag cannot be empty")
        .max(50, "Tag must be at most 50 characters")
        .regex(/^[a-zA-Z0-9-_]+$/, "Tags can only contain letters, numbers, hyphens, and underscores")
        .refine((val) => val.trim().length > 0, {
          message: "Tag cannot be only whitespace",
        })
    )
    .max(10, "You can add at most 10 tags")
    .optional(),
});

// Comment schemas
export const commentSchema = z.object({
  body: z
    .string()
    .min(1, "Comment cannot be empty")
    .max(1000, "Comment must be at most 1000 characters")
    .refine((val) => val.trim().length > 0, {
      message: "Comment cannot be only whitespace",
    }),
  parent: z.number().optional(),
});

// User profile schema
export const userProfileSchema = z.object({
  bio: z.string().max(500, "Bio must be at most 500 characters").optional(),
  phone: z.string().min(1, "Phone is required"),
  location: z.string().min(1, "Location is required"),
});

// Types inferred from schemas
export type RegisterFormData = z.infer<typeof registerSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type IdeaFormData = z.infer<typeof ideaSchema>;
export type CommentFormData = z.infer<typeof commentSchema>;
export type UserProfileFormData = z.infer<typeof userProfileSchema>;
