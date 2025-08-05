import { z } from "zod";

export const JobSchema = z.object({
  title: z.string().min(1, "Title is required"),
  company: z.string().min(1, "Company is required"),
  location: z.string().min(1, "Location is required"),
});

export type JobInput = z.infer<typeof JobSchema>;
