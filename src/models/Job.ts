import { Schema, model, Document, Types } from "mongoose";

export interface IJob extends Document {
  _id: Types.ObjectId;
  title: string;
  company: string;
  location: string;
}

const jobSchema = new Schema<IJob>(
  {
    title: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export const Job = model<IJob>("Job", jobSchema);
