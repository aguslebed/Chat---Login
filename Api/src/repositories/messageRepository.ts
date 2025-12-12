import { messageModel, IMessage } from "../models/messageModel";

export class MessageRepository {
    async findGlobal(limit: number = 100): Promise<IMessage[]> {
        return await messageModel.find({ recipient: 'global' })
            .sort({ createdAt: 1 })
            .limit(limit);
    }

    async findPrivate(user1Id: string, user2Id: string, limit: number = 100): Promise<IMessage[]> {
        return await messageModel.find({
            $or: [
                { sender: user1Id, recipient: user2Id },
                { sender: user2Id, recipient: user1Id }
            ]
        })
            .sort({ createdAt: 1 })
            .limit(limit);
    }

    async findByParticipant(userId: string): Promise<IMessage[]> {
        return await messageModel.find({
            $or: [{ sender: userId }, { recipient: userId }]
        });
    }
}
export default MessageRepository;
