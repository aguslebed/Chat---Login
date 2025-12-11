import { IUserModel } from "../models/userModel";


export const userFormatter = (user: IUserModel) => {
    return {
        id: user._id.toString(),
        email: user.email,
        userName: user.userName,
        isActive: user.isActive,
        isGuest: user.isGuest,
    }
}
