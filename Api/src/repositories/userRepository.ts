import { IUser, IUserModel, userModel } from "../models/userModel";

export class UserRepository {
    async create(user: Omit<IUser, "_id">): Promise<IUserModel> {
        return await userModel.create(user);
    }

    async findByEmail(email: string): Promise<IUserModel | null> {
        return await userModel.findOne({ email: email, isActive: true });
    }

    async findByUserName(userName: string): Promise<IUserModel | null> {
        return await userModel.findOne({ userName: userName, isActive: true });
    }

    async findById(id: string): Promise<IUserModel | null> {
        return await userModel.findOne({ _id: id, isActive: true });
    }

    async delete(id: string): Promise<IUserModel | null> {
        return await userModel.findByIdAndDelete(id);
    }


}

export default UserRepository
