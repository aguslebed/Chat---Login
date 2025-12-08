import { IUserModel } from "../models/userModel";

export class IAuthService {
    async register(email: string, password: string, userName: string): Promise<IUserModel> { throw new Error("Method not implemented"); };
    async login(email: string, password: string): Promise<{ user: IUserModel, token: string }> { throw new Error("Method not implemented"); };
    async logout(): Promise<void> { throw new Error("Method not implemented"); };
    async me(): Promise<IUserModel> { throw new Error("Method not implemented"); };
}