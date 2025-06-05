import jwt from "jsonwebtoken";
import User from "../models/User.js"; // Adjust path as needed

export const protectRoute = async (req, res, next) => {
    try {
        // Expecting: Authorization: Bearer <token>
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ success: false, message: "No token provided" });
        }
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId).select('-password');
        if (!user) return res.status(401).json({ success: false, message: 'User not found' });
        req.user = user;
        next();
    } catch (error) {
        console.log(error.message);
        res.status(401).json({ success: false, message: error.message });
    }
};

// Controller to check if user is authenticated
export const checkAuth = (req, res) => {
    res.json({ success: true, user: req.user });
};
