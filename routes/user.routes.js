import { Router } from "express";
import { SignIn, SignUp } from "../controller/user.controller.js";
import multer from "multer";
import { verifyToken } from "../utils/verifyToken.js";
import { uploadSingleCSV, uploadMultipleCSV } from "../controller/file.controller.js";

const router = Router();

// Set up storage configuration for Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    },
});

// Create the multer instance with the storage configuration
const upload = multer({ storage });

// User Registration Route
router.post("/register", SignUp);

// User Login Route
router.post("/login", SignIn);

// Single File Upload Route
// 
router.post("/upload", verifyToken, upload.single('csvfile'), uploadSingleCSV);

// Multiple File Upload Route
router.post("/uploads-multiple", verifyToken, upload.array('csvFiles', 10), uploadMultipleCSV);

export default router;
