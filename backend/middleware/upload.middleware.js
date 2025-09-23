import multer from "multer";
import path from "path";
import fs from "fs";

const uploadBase = path.join(process.cwd(), "uploads");
const folders = ["News", "MP", "Laws", "User", "Party"];
folders.forEach((folder) => {
  const dir = path.join(uploadBase, folder);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = "News";
    if (file.fieldname === "law") folder = "Laws";
    // if (file.mimetype === "application/pdf") folder = "pdf";
    else if (file.fieldname === "profile") folder = "MP";
    else if (file.fieldname === "user") folder = "User";
    else if (file.fieldname === "party") folder = "Party";
    else if (file.fieldname === "news") folder = "News";
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
export const postUploadMiddleware = (req, res, next) => {
  // Use array field + max files
  upload.array("news", 5)(req, res, (err) => {
    if (err) {
      console.log(err.code);
      // Custom message for too many files
      if (err.code === "LIMIT_FILE_COUNT") {
        // Optional: delete uploaded files if needed
        if (req.files) {
          req.files.forEach((file) => {
            const filePath = path.join(  
              process.cwd(),
              "/uploads/News",
              file.filename
            );
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
          });
        }
        return res.status(400).json({
          status: false,
          message: "You can upload a maximum of 5 files only!",
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

// Middleware to handle upload + custom errors
export const userUploadMiddleware = (req, res, next) => {
  // Use array field + max files
  upload.single("user")(req, res, (err) => {
    if (err) {
      console.log(err.code);
      // Custom message for too many files
      if (err.code === "LIMIT_UNEXPECTED_FILE") {
        // Optional: delete uploaded files if needed
        const temportyFile = path.join(
          process.cwd(),
          `/uploads/User/${req.file.filename}`
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
        message: err.message || "File upload error",
      });
    }

    next(); // Files uploaded successfully
  });
};

// Middleware to handle upload + custom errors
export const profileUploadMiddleware = (req, res, next) => {
  // Use array field + max files
  upload.single("profile")(req, res, (err) => {
    if (err) {
      console.log(err.code);
      // Custom message for too many files
      if (err.code === "LIMIT_UNEXPECTED_FILE") {
        // Optional: delete uploaded files if needed
        const temportyFile = path.join(
          process.cwd(),
          `/uploads/MP/${req.file.filename}`
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

// Middleware to handle upload + custom errors
export const lawUploadMiddleware = (req, res, next) => {
  // Use array field + max files
  upload.single("law")(req, res, (err) => {
    if (err) {
      console.log(err.code);
      console.log(err.code);
      // Custom message for too many files
      if (err.code === "LIMIT_UNEXPECTED_FILE") {
        // Optional: delete uploaded files if needed
        const temportyFile = path.join(
          process.cwd(),
          `/uploads/Laws/${req.file.filename}`
        );
        if (fs.existsSync(temportyFile)) fs.unlinkSync(temportyFile);
        return res.status(400).json({
          status: false,
          message: "You can upload a maximum of 1 pdf file only!",
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

// Middleware to handle upload + custom errors
export const partyUploadMiddleware = (req, res, next) => {
  // Use array field + max files
  upload.single("party")(req, res, (err) => {
    if (err) {
      console.log(err.code);
      // Custom message for too many files
      if (err.code === "LIMIT_UNEXPECTED_FILE") {
        // Optional: delete uploaded files if needed
        const temportyFile = path.join(
          process.cwd(),
          `/uploads/Party/${req.file.filename}`
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
        message: err.message || "File upload error",
      });
    }

    next(); // Files uploaded successfully
  });
};
