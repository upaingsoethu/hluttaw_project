import Law from "../models/law.model.js";
import mongoose from "mongoose";
import path from "path";
import fs from "fs";

// Helper: check valid MongoDB ObjectId


// ----------------- CREATE LAW -----------------
export const createLaw = async (req, res) => {
  try {
    const { lawNo, description, hluttawId } = req.body;
    const file = req.file || null;

    if (!lawNo || !description || !hluttawId ) {
      return res.status(400).json({ message: "All fields are required." });
    }
    if (!isValidObjectId(hluttawId)) {
      return res.status(400).json({ message: "Invalid hluttawId." });
    }

    const uploadedFile = file
      ? {
          fileName: file.originalname,
          filePath: file.path,
          fileSize: file.size,
          fileType: file.mimetype,
          downloadUrl: `${req.protocol}://${req.get(
            "host"
          )}/${file.path.replace(/\\/g, "/")}`,
        }
      : undefined;

    const newLaw = new Law({
      lawNo,
      description,
      hluttawId,
      downloadUrl,
      uploadedFile,
    });

    const savedLaw = await newLaw.save();
    res.status(201).json(savedLaw);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error." });
  }
};

// ----------------- GET ALL LAWS -----------------
export const getAllLaws = async (req, res) => {
  try {
    const laws = await Law.find().populate("hluttawId", "name shortName");
    res.status(200).json(laws);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error." });
  }
};

// ----------------- GET SINGLE LAW -----------------
export const getLawById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id))
      return res.status(400).json({ message: "Invalid law ID." });

    const law = await Law.findById(id).populate("hluttawId", "name shortName");
    if (!law) return res.status(404).json({ message: "Law not found." });

    res.status(200).json(law);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error." });
  }
};

// ----------------- UPDATE LAW -----------------
export const updateLaw = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      lawNo,
      description,
      hluttawId,
      downloadUrl,
      downloadCount,
      downloadRating,
    } = req.body;
    const file = req.file || null;

    if (!isValidObjectId(id))
      return res.status(400).json({ message: "Invalid law ID." });
    if (hluttawId && !isValidObjectId(hluttawId))
      return res.status(400).json({ message: "Invalid hluttawId." });

    const updateData = {
      lawNo,
      description,
      hluttawId,
      downloadUrl,
      downloadCount,
      downloadRating,
    };

    if (file) {
      updateData.uploadedFile = {
        fileName: file.originalname,
        filePath: file.path,
        fileSize: file.size,
        fileType: file.mimetype,
        downloadUrl: `${req.protocol}://${req.get("host")}/${file.path.replace(
          /\\/g,
          "/"
        )}`,
      };
    }

    const updatedLaw = await Law.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
    if (!updatedLaw) return res.status(404).json({ message: "Law not found." });

    res.status(200).json(updatedLaw);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error." });
  }
};

// ----------------- DELETE LAW -----------------
export const deleteLaw = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id))
      return res.status(400).json({ message: "Invalid law ID." });

    const deletedLaw = await Law.findByIdAndDelete(id);
    if (!deletedLaw) return res.status(404).json({ message: "Law not found." });

    // Optional: delete uploaded file from server
    if (deletedLaw.uploadedFile && deletedLaw.uploadedFile.filePath) {
      const filePath = path.join(
        process.cwd(),
        deletedLaw.uploadedFile.filePath
      );
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    res.status(200).json({ message: "Law deleted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error." });
  }
};

// ----------------- DOWNLOAD LAW FILE -----------------
export const downloadLawFile = async (req, res) => {
  try {
    const { id } = req.params;
    const law = await Law.findById(id);
    if (!law || !law.uploadedFile)
      return res.status(404).json({ message: "File not found." });

    // Increment downloadCount
    law.downloadCount += 1;
    await law.save();

    const filePath = path.join(process.cwd(), law.uploadedFile.filePath);
    if (!fs.existsSync(filePath))
      return res.status(404).json({ message: "File not found on server." });

    res.download(filePath, law.uploadedFile.fileName);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error." });
  }
};
