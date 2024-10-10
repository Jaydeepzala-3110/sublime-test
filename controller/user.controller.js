import { User } from "../model/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const generateToken = (userId) => {
    const secretKey = process.env.JWT_TOKEN_SECRET;
    const token = jwt.sign({ userId }, secretKey);
    return token;
};


export const SignUp = async (req, res) => {
    const { name, email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ msg: "Please add your email and password." });
    }


    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ msg: "User already exists with this email." });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const user = await User.create({
        name,
        email,
        password: hashedPassword,
    });

    // Generate JWT token
    const token = generateToken(user._id);

    res.status(201).json({
        user: user.name,
        token,
    });
};

export const SignIn = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ msg: "Please provide your credentials." });
    }

    // Find the user by email
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
        return res.status(401).json({ msg: "User does not exist." });
    }

    // Compare the password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        return res.status(401).json({ msg: "Invalid credentials." });
    }

    // Generate JWT token
    const token = generateToken(user._id);

    res.status(200).json({
        user: user.name,
        token,
    });
};

// CSV Upload

