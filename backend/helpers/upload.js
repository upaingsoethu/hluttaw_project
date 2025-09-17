import multer from "multer";
import path from "path";
import fs from "fs";

// Base upload folder
const uploadBase = path.join(process.cwd(), "uploads");

// Ensure folders exist
const folders = ["images", "profile", "pdf"];
folders.forEach((folder) => {
  const dir = path.join(uploadBase, folder);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// Multer storage with type-based folder
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = "images"; // default

    if (file.mimetype === "application/pdf") folder = "pdf";
    else if (file.fieldname === "profilePhoto") folder = "profile"; // field name for MP profile

    cb(null, path.join(uploadBase, folder));
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueName + ext);
  },
});

// Multer upload
export const handleUpload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
  fileFilter: (req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "application/pdf"];
    if (!allowed.includes(file.mimetype)) {
      const error = new Error("Only JPG, PNG, PDF files are allowed!");
      error.statusCode = 400;
      return cb(error);
    }
    cb(null, true);
  },
});

// import multer from "multer";
// import path from "path";
// import fs from "fs";

// // Upload folder create if not exists
// const uploadDir = path.join(process.cwd(), "uploads");
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir);
// }

// // Multer storage setup
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, uploadDir); // save in /uploads folder
//   },
//   filename: function (req, file, cb) {
//     const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     const ext = path.extname(file.originalname);
//     cb(null, uniqueName + ext);
//   },
// });

// export const upload = multer({
//   storage,
//   limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max per file
//   fileFilter(req, file, cb) {
//     const allowed = ["image/jpeg", "image/png", "application/pdf"];
//     if (!allowed.includes(file.mimetype)) {
//       return cb((error = new Error("Only JPG, PNG , PDF  files are allowed!") , error.statusCode = 400));
//     }
//     cb(null, true);
//   },
// });

// export const handleUpload = (req, res) => {
//   return new Promise((resolve, reject) => {
//     upload.array("images", 5)(req, res, (err) => {
//       if (err) return reject(err);
//       resolve(req.files || []);
//     });
//   });
// };

// export const deleteFiles = (files) => {
//   if (!files || files.length === 0) return;
//   files.forEach((file) => {
//     const filePath = path.join(process.cwd(), "uploads", file.filename);
//     if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
//   });
// };

// export const getFileUrl = (req, file) => {
//   return `${req.protocol}://${req.get("host")}/uploads/${file.filename}`;
// };
