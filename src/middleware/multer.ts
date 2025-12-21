import multer from "multer";
import fs from "node:fs";
import path from "node:path";

const uploadDir = path.join(process.cwd(), "uploads");

// Create folder if not exists
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, uploadDir);
    },
    filename: (_req, file, cb) => {
        const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, `${unique}${path.extname(file.originalname)}`);
    },
});

const fileFilter: multer.Options["fileFilter"] = (_req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
        cb(new Error("Only image files are allowed"));
    } else {
        cb(null, true);
    }
};

export const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 2 * 1024 * 1024, // 2MB
    },
});
