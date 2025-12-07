import { IUser } from "../models/userModel";

export class IAuthService {
    async register(email: string, password: string, userName: string): Promise<IUser> { throw new Error("Method not implemented"); };
    async login(email: string, password: string): Promise<{ user: IUser, token: string }> { throw new Error("Method not implemented"); };
    async logout(): Promise<void> { throw new Error("Method not implemented"); };
    async me(): Promise<void> { throw new Error("Method not implemented"); };
}