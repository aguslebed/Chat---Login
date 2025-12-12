import { IMessage } from "../models/messageModel";

export interface IConversationUser {
    id: any;
    name: string;
    status: string;
}

export class IMessageService {
    async getGlobalMessages(): Promise<IMessage[]> { throw new Error("Method not implemented"); }
    async getPrivateMessages(currentUserId: string, otherUserId: string): Promise<IMessage[]> { throw new Error("Method not implemented"); }
    async getConversations(currentUserId: string): Promise<IConversationUser[]> { throw new Error("Method not implemented"); }
}
