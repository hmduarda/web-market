import User, { IUser } from "../models/User";
import { generateToken } from "../utils/jwt";

export class UserService {
  async createUser(data: { name: string; email: string; password: string; role?: "admin" | "customer" }): Promise<IUser> {
    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) {
      throw new Error("Email already registered");
    }

    const user = new User({
      name: data.name,
      email: data.email,
      password: data.password,
      role: data.role || "customer",
    });

    await user.save();
    return user;
  }

  async login(email: string, password: string): Promise<{ token: string; user: IUser }> {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      throw new Error("Invalid credentials");
    }

    const token = generateToken(user._id.toString(), user.role);
    return { token, user };
  }

  async getUserById(id: string): Promise<IUser | null> {
    return await User.findById(id).select("-password") as IUser | null;
  }

  async listUsers(): Promise<IUser[]> {
    return await User.find().select("-password");
  }

  async updateUser(id: string, data: Partial<{ name: string; password: string }>): Promise<IUser | null> {
    const user = await User.findById(id);
    if (!user) {
      throw new Error("User not found");
    }

    if (data.name) user.name = data.name;
    if (data.password) user.password = data.password;

    await user.save();
    return user;
  }

  async deleteUser(id: string): Promise<void> {
    const user = await User.findById(id);
    if (!user) {
      throw new Error("User not found");
    }

    await User.deleteOne({ _id: id });
  }
}

export default new UserService();
