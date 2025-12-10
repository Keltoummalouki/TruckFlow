import User from "../models/userModel.js";
import { verifyAccessToken } from "../utils/jwtUtils.js";

export const authenticate = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        
        if (!token) {
            return res.status(401).json({ success: false, message: "No token provided" });
        }

        const decoded = verifyAccessToken(token);
        const user = await User.findById(decoded.id);

        if (!user || !user.isActive) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        req.user = {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
        };
        
        next();
    } catch (error) {
        res.status(401).json({ success: false, message: "Invalid token" });
    }
};

export const authorize = (...roles) => {
    return (req, res, next) => {
            if (!roles.includes(req.user.role)) {
            return res.status(403).json({ success: false, message: "Access denied" });
        }
        next();
    };
};
