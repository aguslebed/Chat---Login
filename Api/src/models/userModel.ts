import { Schema, model, Document } from "mongoose";
import bcrypt from "bcrypt";

export interface IUser {
    userName: string
    email: string
    password: string
    isActive: boolean
    _id: string
    isGuest?: boolean
}

export interface IUserModel extends Omit<IUser, "_id">, Document { }

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
    isActive: { type: Boolean, default: true },
}, { timestamps: true })


export const userModel = model<IUserModel>("User", userSchema)