import multer from "multer";
import path from "path";
import fs from "fs";

const uploadBase = path.join(process.cwd(), "uploads");
const folders = ["images", "profile", "pdf"];
folders.forEach((folder) => {
  const dir = path.join(uploadBase, folder);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = "images";
    if (file.mimetype === "application/pdf") folder = "pdf";
    else if (file.fieldname === "profilePhoto") folder = "profile";
    cb(null, path.join(uploadBase, folder));
  },
  filename: (req, file, cb) => {
    const uniqueFileName = Date.now() + "-" + file.originalname;
    const fileExtension = path.extname(file.originalname);
    cb(null, uniqueFileName + fileExtension);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
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

export const handleUpload = (req, res) =>
  new Promise((resolve, reject) => {
    upload.single("file")(req, res, (err) => {
      if (err) return reject(err);
      resolve(req.file);
    });
  });
