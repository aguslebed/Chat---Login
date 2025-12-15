import { Schema, model, Document } from "mongoose";

export interface IVerificationCode extends Document {
    email: string;
    code: string;
    createdAt: Date;
}

const verificationCodeSchema = new Schema<IVerificationCode>({
    email: { type: String, required: true },
    code: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, expires: 600 } // Expires in 10 minutes (600 seconds)
});

export const verificationCodeModel = model<IVerificationCode>("VerificationCode", verificationCodeSchema);
