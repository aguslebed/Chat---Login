import { Schema, model, Document, Types } from "mongoose";

export interface IMessage extends Document {
    sender: Types.ObjectId | string; // ObjectId for users, string for Guests? Or mixed.
    senderName: string;
    recipient: Types.ObjectId | string; // ObjectId or 'global'
    content: string;
    createdAt: Date;
}

const messageSchema = new Schema<IMessage>({
    sender: { type: Schema.Types.Mixed, required: true },
    senderName: { type: String, required: true },
    recipient: { type: Schema.Types.Mixed, required: true },
    content: { type: String, required: true },
}, { timestamps: true });

export const messageModel = model<IMessage>("Message", messageSchema);
