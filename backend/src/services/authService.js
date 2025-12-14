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

export const getUsers = async (query = {}) => {
    const {
        page = 1,
        limit = 10,
        role,
        search = ''
    } = query;

    // Build filter
    const filter = { isActive: true };
    if (role) {
        filter.role = role;
    }

    // Add search if provided
    if (search) {
        filter.$or = [
            { firstName: { $regex: search, $options: 'i' } },
            { lastName: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } }
        ];
    }

    const skip = (page - 1) * limit;

    // Execute query
    const users = await User
        .find(filter)
        .select('-password -passwordResetToken -passwordResetExpire')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));

    const total = await User.countDocuments(filter);

    return {
        data: users,
        pagination: {
            currentPage: parseInt(page),
            totalPages: Math.ceil(total / limit),
            totalItems: total,
            itemsPerPage: parseInt(limit),
            hasNextPage: page * limit < total,
            hasPrevPage: page > 1
        }
    };
};

