import User from "../models/userModel.js";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../utils/jwtUtils.js";

export const registerUser = async (userData) => {
    const { email } = userData;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new Error("Email already exists");
}

    const user = await User.create(userData);
    const accessToken = generateAccessToken(user._id, user.role);
    const refreshToken = generateRefreshToken(user._id);

    return {
        user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        },
        accessToken,
        refreshToken,
    };
};

export const loginUser = async (email, password) => {
    const user = await User.findOne({ email, isActive: true }).select("+password");
  
    if (!user || !(await user.comparePassword(password))) {
        throw new Error("Invalid credentials");
    }

    const accessToken = generateAccessToken(user._id, user.role);
    const refreshToken = generateRefreshToken(user._id);

    return {
        user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        },
        accessToken,
        refreshToken,
    };
};

export const refreshAccessToken = async (refreshToken) => {
    const decoded = verifyRefreshToken(refreshToken);
    const user = await User.findById(decoded.id);

    if (!user || !user.isActive) {
        throw new Error("User not found");
    }

    const accessToken = generateAccessToken(user._id, user.role);
    return { accessToken };
};
