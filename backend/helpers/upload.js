import multer from "multer";
import path from "path";
import fs from "fs";

const uploadBase = path.join(process.cwd(), "uploads");
const folders = ["News", "Profiles", "Laws"];
folders.forEach((folder) => {
  const dir = path.join(uploadBase, folder);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = "News";
    if (file.fieldname === "law") folder = "Laws";
    // if (file.mimetype === "application/pdf") folder = "pdf";
    else if (file.fieldname === "Profile") folder = "Profiles";
    cb(null, path.join(uploadBase, folder));
  },
  filename: (req, file, cb) => {
    const uniqueFileName = Date.now() + "-" + path.basename(file.originalname);
    const fileExtension = path.extname(file.originalname);
    cb(null, uniqueFileName + fileExtension);
  },
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



export const handleLawUpload = (req, res) =>
  new Promise((resolve, reject) => {
    upload.single("law")(req, res, (err) => {
      if (err) return reject(err);
      resolve(req.file);
    });
  });


  export const handlePostUpload = (req, res) =>
    new Promise((resolve, reject) => {
      upload.array("news" ,5)(req, res, (err) => {
        if (err) return reject(err);
        resolve(req.files);
      });
    });


 export const handleProfileUpload = (req, res) =>
   new Promise((resolve, reject) => {
     upload.single("profile")(req, res, (err) => {
       if (err) return reject(err);
       resolve(req.file);
     });
   });


//   // Function to handle news photo array upload
// export const handleNewsPhotoUpload = (req, res) => {
//     upload.array('photos', 5)(req, res, (err) => {
//         if (err instanceof multer.MulterError) {
//             // A Multer error occurred when uploading.
//             return res.status(500).json({ error: err.message });
//         } else if (err) {
//             // An unknown error occurred.
//             return res.status(500).json({ error: err.message });
//         }

//         // Validation logic here
//         // Example: Check if any files were uploaded
//         if (!req.files || req.files.length === 0) {
//             return res.status(400).json({ error: 'Please upload at least one photo.' });
//         }

//         // If validation succeeds, proceed with saving to the database or other tasks.
//         const filePaths = req.files.map(file => file.path);
//         res.status(200).json({
//             message: 'Photos uploaded successfully.',
//             filePaths: filePaths
//         });
//     });
// };

// export // Function to handle single profile photo upload
// const handleProfilePhotoUpload = (req, res) => {
//   upload.single("profilePhoto")(req, res, (err) => {
//     if (err instanceof multer.MulterError) {
//       return res.status(500).json({ error: err.message });
//     } else if (err) {
//       return res.status(500).json({ error: err.message });
//     }

//     // Validation logic here
//     // Example: Check if the file exists and is an image
//     if (!req.file) {
//       return res.status(400).json({ error: "Please upload a profile photo." });
//     }
//     if (!req.file.mimetype.startsWith("image/")) {
//       // If the file is not an image, delete it and send an error
//       fs.unlinkSync(req.file.path);
//       return res.status(400).json({ error: "Only image files are allowed." });
//     }

//     // If validation succeeds, process the file path.
//     res.status(200).json({
//       message: "Profile photo uploaded successfully.",
//       filePath: req.file.path,
//     });
//   });
// };

// // Function to handle PDF file upload
// export const handleLawDocumentUpload = (req, res) => {
//   upload.single("law")(req, res, (err) => {
//     if (err instanceof multer.MulterError) {
//       return res.status(500).json({ error: err.message });
//     } else if (err) {
//       return res.status(500).json({ error: err.message });
//     }

//     // Validation logic here
//     // Example: Check if the file exists and is a PDF
//     if (!req.file) {
//       return res.status(400).json({ error: "Please upload a law document." });
//     }
//     if (req.file.mimetype !== "application/pdf") {
//       // If the file is not a PDF, delete it and send an error
//       fs.unlinkSync(req.file.path);
//       return res.status(400).json({ error: "Only PDF files are allowed." });
//     }

//     // If validation succeeds, process the file path.
//     res.status(200).json({
//       message: "Law document uploaded successfully.",
//       filePath: req.file.path,
//     });
//   });
// };


// A single function to handle all upload types
// export const handleUpload = (req, res, next) => {
//     // ... (uploadMiddleware logic) ...

//     uploadMiddleware(req, res, (err) => {
//       // ... (error handling) ...
      
//       // Validation succeeded, files are uploaded.
//       if (req.body.type === 'news' && req.files) {
//         // Handle news photos
//         const filePaths = req.files.map(file => `/uploads/news/${file.filename}`);
//         return res.status(200).json({ message: "News photos uploaded successfully.", files: filePaths });
//       } else if ((req.body.type === 'profile' || req.body.type === 'law') && req.file) {
//         // Handle single file uploads
//         // Use req.file.filename here to get the correct name
//         const filePath = `/uploads/laws/${req.file.filename}`;
//         return res.status(200).json({ message: "File uploaded successfully.", filePath: filePath });
//       } else {
//         return res.status(400).json({ error: "No files were uploaded or an invalid type was provided." });
//       }
//     });
// };
