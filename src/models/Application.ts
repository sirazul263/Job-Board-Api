import { Schema, model, Document, Types } from "mongoose";

export interface IApplication extends Document {
  applicantName: string;
  applicantEmail: string;
  jobId: Types.ObjectId;
  resumeUrl?: string;
}

const applicationSchema = new Schema<IApplication>(
  {
    applicantName: { type: String, required: true },
    applicantEmail: {
      type: String,
      required: true,
      match: [/\S+@\S+\.\S+/, "Please enter a valid email"],
    },
    jobId: { type: Schema.Types.ObjectId, ref: "Job", required: true },
    resumeUrl: {
      type: String,
      required: false,
      validate: {
        validator: (v: string) => {
          if (!v) return true; // optional field
          return /^https?:\/\/.+/.test(v);
        },
        message: "Please enter a valid URL",
      },
    },
  },
  {
    timestamps: true,
  }
);

export const Application = model<IApplication>(
  "Application",
  applicationSchema
);
