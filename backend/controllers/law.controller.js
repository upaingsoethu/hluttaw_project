import Law from "../models/law.model.js";
import { handleLawUpload } from "../helpers/upload.js"; // multer function-style

// ✅ Create Law (with file upload)
export const createLaw = async (req, res) => {
  try {
    const file = await handleLawUpload(req, res); // multer function-style
    const { lawNo, lawDescription, hluttawId } = req.body;
    const downlaodLink = `/uploads/laws/${
      req.file.filename
    }`;
    const law = new Law({
      lawNo,
      lawDescription,
      hluttawId,
      downloadUrl: downlaodLink,
    });

    await law.save();
    res.status(201).json({
      status: true,
      message: "Law created successfully!",
      data: law,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// ✅ Read All Laws
export const LawsList = async (req, res) => {
  try {
    const laws = await Law.find().populate("hluttawId").sort({
      createdAt: -1,
    });
    if (laws.length === 0) {
      const error = new Error("No Laws data found!");
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({
      status: true,
      message: "Laws data retrieved successfully!",
      data: laws,
    });
  } catch (error) {
    if (error.statusCode) {
      throw error;
    }
    error.message = "Server Error in fetching laws!";
    throw error;
  }
};

// ✅ Update Law (optionally with new file)
export const updateLaw = async (req, res) => {
  try {
    const law = await Law.findById(req.params.id);
    if (!law) return res.status(404).json({ error: "Law not found" });

    let file = null;
    try {
      file = await handleUpload(req, res); // optional new file
    } catch {}

    if (file) {
      // delete old file
      if (fs.existsSync(law.downloadUrl)) fs.unlinkSync(law.downloadUrl);
      law.downloadUrl = file.path;
    }

    law.lawNo = req.body.lawNo || law.lawNo;
    law.lawDescription = req.body.lawDescription || law.lawDescription;
    law.hluttawId = req.body.hluttawId || law.hluttawId;

    await law.save();
    res.json(law);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// ✅ Delete Law
export const deleteLaw = async (req, res) => {
  try {
    const law = await Law.findById(req.params.id);
    if (!law) return res.status(404).json({ error: "Law not found" });

    if (fs.existsSync(law.downloadUrl)) fs.unlinkSync(law.downloadUrl);
    await law.deleteOne();
    res.json({ message: "Law deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Read Single Law
export const getLawById = async (req, res) => {
  try {
    const law = await Law.findById(req.params.id).populate("hluttawId");
    if (!law) return res.status(404).json({ error: "Law not found" });
    res.json(law);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
