import { IAuthService } from "../interfaces/IAuthService";
import { userRepository } from "../repository/userRepository";
export class authService extends IAuthService {
    constructor() {
        super();
    }

    async register(email: string, password: string, userName: string): Promise<void> {
        try {

        } catch (error) {
            throw error;
        }
    }
}