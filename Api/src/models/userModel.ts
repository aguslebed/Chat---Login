import { Schema, model, Document } from "mongoose";

export interface IUser {
    userName: string
    email: string
    password: string
}

export interface IUserModel extends IUser, Document { }

const userSchema = new Schema<IUserModel>({
    userName: { type: String, required: true },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: { type: String, required: true },
}, { timestamps: true })


export const userModel = model<IUserModel>("User", userSchema)