export class IAuthService {
    async register(email: string, password: string): Promise<void> { throw new Error("Method not implemented"); };
    async login(email: string, password: string): Promise<void> { throw new Error("Method not implemented"); };
    async logout(): Promise<void> { throw new Error("Method not implemented"); };
    async me(): Promise<void> { throw new Error("Method not implemented"); };
}