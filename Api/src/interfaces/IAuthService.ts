import { IUserModel } from "../models/userModel";

export interface IAuthService {
    register(email: string, password: string, userName: string, code: string): Promise<IUserModel>;
    sendVerificationCode(email: string): Promise<void>;
    login(email: string, password: string): Promise<{ user: IUserModel, token: string }>;
    // logout method removed as it is handled by controller
    getMe(id: string): Promise<IUserModel>;
    getUsers(): Promise<IUserModel[]>;
    getGuest(): Promise<{ user: IUserModel, token: string }>;
    validateEmail(email: string): Promise<IUserModel>;
    forgotPassword(email: string): Promise<void>;
    resetPassword(token: string, password: string): Promise<void>;
}