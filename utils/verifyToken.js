import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();


export const verifyToken = (req, res, next) => {
    
    const token = req.headers.authorization?.replace('Bearer ', '');


    // Check if token is provided
    if (!token) {
        return res.status(403).json({ message: 'No token provided' });
    }

    // Verify the token
    jwt.verify(token, process.env.JWT_TOKEN_SECRET, (err, decoded) => {
        // if (err) {
        //     console.error('Token verification error:', err.message);
        //     return res.status(401).json({ message: 'Invalid token' });
        // }

        // Token is valid; assign user ID to req.user
        req.user = { _id: decoded.userId }; // Assuming your token contains a userId field
        console.log('User ID from token:', req.user._id);

        // Call the next middleware or route handler
        next();
    });
};
