import { IUser } from "../models/userModel";


export const userFormatter = (user: IUser) => {
    return {
        email: user.email,
        userName: user.userName,
        isActive: user.isActive,
    }
}
