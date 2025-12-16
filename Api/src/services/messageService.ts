import { IMessageService, IConversationUser } from "../interfaces/IMessageService";
import MessageRepository from "../repositories/messageRepository";
import UserRepository from "../repositories/userRepository";
import { IMessage } from "../models/messageModel";

export class MessageService extends IMessageService {
    private messageRepository: MessageRepository;
    private userRepository: UserRepository;

    constructor() {
        super();
        this.messageRepository = new MessageRepository();
        this.userRepository = new UserRepository();
    }

    async getGlobalMessages(): Promise<IMessage[]> {
        return await this.messageRepository.findGlobal();
    }

    async getPrivateMessages(currentUserId: string, otherUserId: string): Promise<IMessage[]> {
        return await this.messageRepository.findPrivate(currentUserId, otherUserId);
    }

    async getConversations(currentUserId: string): Promise<IConversationUser[]> {
        const messages = await this.messageRepository.findByParticipant(currentUserId);

        const partnerIds = new Set<string>();
        messages.forEach(msg => {
            const senderId = typeof msg.sender === 'string' ? msg.sender : msg.sender.toString();
            const recipientId = typeof msg.recipient === 'string' ? msg.recipient : msg.recipient.toString();

            if (senderId !== currentUserId && senderId !== 'global') partnerIds.add(senderId);
            if (recipientId !== currentUserId && recipientId !== 'global') partnerIds.add(recipientId);
        });

        const partners = await this.userRepository.findByIds(Array.from(partnerIds));

        const results = partners.map(u => ({
            id: u._id,
            name: u.userName,
            status: 'offline'
        }));

        return results;
    }
}
