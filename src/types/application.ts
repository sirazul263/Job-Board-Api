import { z } from "zod";

export const ApplicationSchema = z.object({
  applicantName: z.string().min(1, "Applicant Name is required"),
  applicantEmail: z.string().email("Invalid email"),
  jobId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid Job ID format"),
  resumeUrl: z.string().url("Invalid resume URL"),
});

export type ApplicationInput = z.infer<typeof ApplicationSchema>;
