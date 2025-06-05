import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils.js";
import cloudinary from "../lib/cloudinary.js";

// Sign Up a new User
export const signup = async (req, res) => {
    const { fullName, email, password, bio } = req.body;

    try {
        if (!fullName || !email || !password || !bio) {
            return res.status(400).json({ success: false, message: 'Missing Details' });
        }
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ success: false, message: 'Account already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = await User.create({
            fullName,
            email,
            password: hashedPassword,
            bio
        });

        const token = generateToken(newUser._id);

        // Remove password before sending user data
        const userObj = newUser.toObject();
        delete userObj.password;

        res.status(201).json({ success: true, userData: userObj, token, message: 'Account created successfully' });
    }
    catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Controller to login a user
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const userData = await User.findOne({ email });
        if (!userData) {
            return res.status(401).json({ success: false, message: 'Invalid Credentials' });
        }

        const isPasswordCorrect = await bcrypt.compare(password, userData.password);

        if (!isPasswordCorrect) {
            return res.status(401).json({ success: false, message: 'Invalid Credentials' });
        }

        const token = generateToken(userData._id);

        // Remove password before sending user data
        const userObj = userData.toObject();
        delete userObj.password;

        res.json({ success: true, userData: userObj, token, message: 'Login Successful' });
    }
    catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Controller to update user profile details
export const updateProfile = async (req, res) => {
    try {
        const { profilePic, bio, fullName } = req.body;
        const userId = req.user._id;
        let updatedFields = {};
        if (bio !== undefined) updatedFields.bio = bio;
        if (fullName !== undefined) updatedFields.fullName = fullName;

        if (profilePic) {
            const upload = await cloudinary.uploader.upload(profilePic);
            updatedFields.profilePic = upload.secure_url;
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            updatedFields,
            { new: true }
        ).select('-password');

        res.json({ success: true, user: updatedUser });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};
