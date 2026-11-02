import { z } from "zod";
import { CURRICULA, GRADES, HEARD_FROM, INTERESTS } from "./event";

const phone = z
  .string({ error: "Enter your mobile number" })
  .trim()
  .transform((v) => v.replace(/[\s-]/g, ""))
  .pipe(z.string().regex(/^(\+?20)?0?1[0125]\d{8}$|^\+\d{8,15}$/, "Enter a valid phone number"));

export const registrationSchema = z
  .object({
    role: z.enum(["student", "parent", "educator"]),
    fullName: z.string().trim().min(3, "Please enter your full name").max(120),
    email: z.string().trim().toLowerCase().email("Enter a valid email"),
    phone,
    school: z.string().trim().max(160).optional().default(""),
    grade: z.enum(GRADES as [string, ...string[]]).optional(),
    curriculum: z.enum(CURRICULA as [string, ...string[]]).optional(),
    interests: z.array(z.enum(INTERESTS as [string, ...string[]])).max(10).default([]),
    guardianPhone: z.string().trim().max(20).optional().default(""),
    heardFrom: z.enum(HEARD_FROM as [string, ...string[]]).optional(),
    attendees: z.coerce.number().int().min(1).max(5).default(1),
    consent: z.literal(true, { error: "Please accept to continue" }),
    website: z.string().max(0).optional(), // honeypot
  })
  .superRefine((v, ctx) => {
    if (v.role === "student") {
      if (!v.school) ctx.addIssue({ code: "custom", path: ["school"], message: "Which school are you from?" });
      if (!v.grade) ctx.addIssue({ code: "custom", path: ["grade"], message: "Pick your grade" });
    }
  });

export type RegistrationInput = z.input<typeof registrationSchema>;

export const contactSchema = z.object({
  topic: z.enum(["General", "Partner university", "Sponsor", "Media", "Volunteer"]),
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().toLowerCase().email("Enter a valid email"),
  organization: z.string().trim().max(160).optional().default(""),
  message: z.string().trim().min(10, "Tell us a little more").max(3000),
  website: z.string().max(0).optional(),
});

export const chatSchema = z.object({
  sessionId: z.string().uuid().optional(),
  messages: z
    .array(z.object({ role: z.enum(["user", "assistant"]), content: z.string().min(1).max(2000) }))
    .min(1)
    .max(40),
});

export function fieldErrors(error: z.ZodError) {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}
