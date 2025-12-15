import * as authService from "../services/authService.js";
import User from "../models/userModel.js";

export const register = async (req, res, next) => {
    try {
        const result = await authService.registerUser(req.body);
        res.status(201).json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
};

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const result = await authService.loginUser(email, password);
        res.json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
};

export const refresh = async (req, res, next) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            throw new Error("Refresh token is required");
        }
        const result = await authService.refreshAccessToken(refreshToken);
        res.json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
};

export const getProfile = async (req, res) => {
    res.json({ success: true, data: req.user });
};

// Update profile for authenticated user
export const updateProfile = async (req, res, next) => {
    try {
        const userId = req.user.id; // corrected field name
        const updates = req.body;
        const updatedUser = await User.findByIdAndUpdate(userId, updates, { new: true, runValidators: true }).select('-password');
        res.json({ success: true, data: updatedUser });
    } catch (error) {
        next(error);
    }
};

export const getUsers = async (req, res, next) => {
    try {
        const result = await authService.getUsers(req.query);
        res.json({ success: true, ...result });
    } catch (error) {
        next(error);
    }
};

