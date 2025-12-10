import * as authService from "../services/authService.js";

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
