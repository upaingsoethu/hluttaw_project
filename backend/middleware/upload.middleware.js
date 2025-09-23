import multer from "multer";
import path from "path";
import fs from "fs";

import Law from "../models/law.model.js";
import Party from "../models/party.model.js";
import Post from "../models/post.model.js";
import User from "../models/auth.model.js";

import { mongoIdValidaton } from "../helpers/validation.js";

const uploadBase = path.join(process.cwd(), "uploads");
const folders = ["news", "representatives", "laws", "users", "parties"];
folders.forEach((folder) => {
  const dir = path.join(uploadBase, folder);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = "news";
    if (file.fieldname === "law") folder = "laws";
    // if (file.mimetype === "application/pdf") folder = "pdf";
    else if (file.fieldname === "profile") folder = "representatives";
    else if (file.fieldname === "user") folder = "users";
    else if (file.fieldname === "party") folder = "parties";
    else if (file.fieldname === "images") folder = "news";
    cb(null, path.join(uploadBase, folder));
  },
  filename: (req, file, cb) => {
    const uniqueFileName = Date.now() + "-" + file.originalname;
    //const fileExtension = path.extname(file.originalname);
    cb(null, uniqueFileName);
  },
});

export const upload = multer({
  storage,
  limits: { files: 5 }, // ✅ max 5 files
  //limits: { fileSize: 10 * 1024 * 1024 },
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

// Middleware to handle upload + custom errors
export const postUploadMiddleware = async (req, res, next) => {
  try {
    if (!req.files) {
      const error = new Error("Please upload at least one image for the post!");
      error.status = false;
      error.statusCode = 400;
      throw error;
    }
    if(req.params.id){
      await mongoIdValidaton(req.params.id);
      const post = await Post.findById(req.params.id);
      if(!post){
        const error = new Error("Post not foun!");
        error.status = false;
        error.statusCode = 400;
        throw error;
      }
    }
    // Use array field + max files
    upload.array("images", 5)(req, res, (err) => {
      if (err) {
        // Custom message for too many files
        if (err.code === "LIMIT_FILE_COUNT") {
          // Optional: delete uploaded files if needed
          if (req.files) {
            req.files.forEach((file) => {
              const filePath = path.join(
                process.cwd(),
                "/uploads/news",
                file.filename
              );
              if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
            });
          }
          return res.status(400).json({
            status: false,
            message: "You can upload a maximum of 5 images only!",
          });
        }

        // File type or other Multer errors
        return res.status(400).json({
          status: false,
          message: "File upload error!",
        });
      }
      next(); // Files uploaded successfully
    });
  } catch (error) {}
};

// Middleware to handle upload + custom errors
export const authUploadMiddleware = async (req, res, next) => {
  try {
    if (req.params.id) {
      await mongoIdValidaton(req.params.id);
      const user = await User.findById(req.params.id);
      if (!user) {
        const error = new Error("User not found!");
        error.status = false;
        error.statusCode = 400;
        throw error;
      }
    }
    upload.single("user")(req, res, (err) => {
      if (err) {
        if (err.code === "LIMIT_UNEXPECTED_FILE") {
          // Optional: delete uploaded files if needed
          const temportyFile = path.join(
            process.cwd(),
            `/uploads/users/${req.file.filename}`
          );
          if (fs.existsSync(temportyFile)) fs.unlinkSync(temportyFile);
          return res.status(400).json({
            status: false,
            message: "You can upload a maximum of 1 image file only!",
          });
        }
        // File type or other Multer errors
        return res.status(400).json({
          status: false,
          message: "File upload error!",
        });
      }
      next(); // Files uploaded successfully
    });
  } catch (error) {
    if (error.statusCode) {
      throw error;
    }
    error.message = "Server error in user file upload middleware!";
    throw error;
  }
};

// Middleware to handle upload + custom errors
export const profileUploadMiddleware = (req, res, next) => {
  // Use array field + max files
  upload.single("profile")(req, res, (err) => {
    if (err) {
      // Custom message for too many files
      if (err.code === "LIMIT_UNEXPECTED_FILE") {
        // Optional: delete uploaded files if needed
        const temportyFile = path.join(
          process.cwd(),
          `/uploads/representatives/${req.file.filename}`
        );
        if (fs.existsSync(temportyFile)) fs.unlinkSync(temportyFile);
        return res.status(400).json({
          status: false,
          message: "You can upload a maximum of 1 file only!",
        });
      }

      // File type or other Multer errors
      return res.status(400).json({
        status: false,
        message: err.message || "File upload error",
      });
    }

    next(); // Files uploaded successfully
  });
};

export const lawUploadMiddleware = async (req, res, next) => {
  try {
    if (!req.file) {
      const error = new Error("Law file is required!");
      error.status = false;
      error.statusCode = 400;
      throw error;
    }
    if (req.params.id) {
      await mongoIdValidaton(req.params.id);
      const law = await Law.findById(req.params.id);
      if (!law) {
        const error = new Error("Law not found!");
        error.status = false;
        error.statusCode = 400;
        throw error;
      }
    }
    upload.single("law")(req, res, (err) => {
      if (err) {
        // Custom message for too many files
        if (err.code === "LIMIT_UNEXPECTED_FILE") {
          const tempFile = path.join(
            process.cwd(),
            `/uploads/laws/${req.file.filename}`
          );
          if (fs.existsSync(tempFile)) fs.unlinkSync(tempFile);

          return res.status(400).json({
            status: false,
            message: "You can upload a maximum of 1 law pdf file only!",
          });
        }

        // File type or other Multer errors
        return res.status(400).json({
          status: false,
          message: "File upload error!",
        });
      }

      next(); // Files uploaded successfully
    });
  } catch (error) {
    if (error.statusCode) {
      throw error;
    }
    error.message = "Server error in law upload middleware!";
    throw error;
  }
};

export const partyUploadMiddleware = async (req, res, next) => {
  try {
    if (!req.file) {
      const error = new Error("Party logo is required!");
      error.status = false;
      error.statusCode = 400;
      throw error;
    }
    if (req.params.id) {
      await mongoIdValidaton(req.params.id);
      const party = await Party.findById(req.params.id);
      if (!party) {
        const error = new Error("Party not found!");
        error.status = false;
        error.statusCode = 400;
        throw error;
      }
    }

    upload.single("party")(req, res, (err) => {
      if (err) {
        // Custom message for too many files
        if (err.code === "LIMIT_UNEXPECTED_FILE") {
          const tempFile = path.join(
            process.cwd(),
            `/uploads/parties/${req.file.filename}`
          );
          if (fs.existsSync(tempFile)) fs.unlinkSync(tempFile);

          return res.status(400).json({
            status: false,
            message: "You can upload a maximum of 1 image file only!",
          });
        }

        // File type or other Multer errors
        return res.status(400).json({
          status: false,
          message: "File upload error File type or other Multer errors!",
        });
      }

      next(); // Files uploaded successfully
    });
  } catch (error) {
    if (error.statusCode) {
      throw error;
    }
    error.message = "Server error in party logo upload middleware!";
    throw error;
  }
};
