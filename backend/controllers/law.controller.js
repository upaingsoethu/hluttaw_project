import path from "path";
import fs from "fs";
import moment from "moment/moment.js";
import Law from "../models/law.model.js";
import { lawValidation, mongoIdValidaton } from "../helpers/validation.js";

// Law list
export const LawsList = async (req, res) => {
  try {
    const laws = await Law.find().populate("hluttawId").sort({
      createdAt: -1,
    });
    if (laws.length === 0) {
      const error = new Error("No laws data found!");
      error.status = false;
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({
      status: true,
      message: "Laws data fetched successfully!",
      data: laws.map((law) => {
        return {
          id: law._id,
          lawNo: law.number,
          description: law.description,
          remark: law.remark,
          viewCount: law.viewCount,
          viewRating: law.viewRating,
          downloadCount: law.downloadCount || 0,
          downloadUrl: law.downloadUrl,
          hluttawTime: law.hluttawId.time,
          createdAt: moment(law.createdAt).format("DD-MM-YYYY"),
          updatedAt: moment(law.updatedAt).format("DD-MM-YYYY"),
        };
      }),
    });
  } catch (error) {
    if (error.statusCode) {
      throw error;
    }
    error.message = "Server Error in fetching laws!";
    throw error;
  }
};

// Create Law
export const createLaw = async (req, res) => {
  try {
    const file = req.file; //file get from multer middleware
    const { number, description, remark, hluttawId } = req.body;
    await lawValidation(number, description, remark, hluttawId);
    //check upload pdf file
    if (!file) {
      const error = new Error(".PDF file is required!");
      error.status = false;
      error.statusCode = 404;
      throw error;
    }
    const downloadUrl = `/uploads/Laws/${file.filename}`;
    const law = new Law({
      number,
      description,
      remark,
      hluttawId,
      downloadUrl,
    });

    await law.save();
    await law.populate("hluttawId");
    res.status(201).json({
      status: true,
      message: "Law created successfully!",
      data: {
        id: law._id,
        lawNo: law.number,
        description: law.description,
        remark: law.remark,
        downloadUrl: law.downloadUrl,
        hluttawTime: law.hluttawId.time,
        createdAt: moment(law.createdAt).format("DD-MM-YYYY"),
      },
    });
  } catch (error) {
    if (error.statusCode) {
      throw error;
    }
    error.message = "Server Error in law create!";
    throw error;
  }
};

export const updateLaw = async (req, res) => {
  try {
    const file = req.file; // get from multer middleware

    const { number, description, remark, hluttawId } = req.body;

    await mongoIdValidaton(req.params.id);

    await mongoIdValidaton(hluttawId);

    const law = await Law.findById(req.params.id);
    if (!law) {
      const error = new Error("No laws data found!");
      error.status = false;
      error.statusCode = 404;
      throw error;
    }

    // Optional: delete old file if new uploaded
    if (file && law.downloadUrl) {
      const oldPath = path.join(process.cwd(), law.downloadUrl);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      law.downloadUrl = `/uploads/Laws/${file.filename}`;
    }

    // Update other fields
    law.number = number || law.number;
    law.description = description || law.description;
    law.remark = remark || law.remark;
    law.hluttawId = hluttawId || law.hluttawId;

    await law.save();
    await law.populate("hluttawId");

    res.status(200).json({
      status: true,
      message: "Law updated successfully!",
      data: {
        id: law._id,
        lawNo: law.number,
        description: law.description,
        remark: law.remark,
        hluttawTime: law.hluttawId.time,
        downloadUrl: law.downloadUrl,
        updatedAt: moment(law.updatedAt).format("DD-MM-YY"),
      },
    });
  } catch (err) {
    res.status(400).json({ status: false, message: err.message });
  }
};

// Delete Law
export const deleteLaw = async (req, res) => {
  try {
    await mongoIdValidaton(req.params.id);
    const law = await Law.findById(req.params.id);
    if (!law) {
      const error = new Error("No law data found!");
      error.status = false;
      error.statusCode = 404;
      throw error;
    }

    // Delete law pdf file if exists
    if (law.downloadUrl) {
      const oldPath = path.join(process.cwd(), law.downloadUrl);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    await law.deleteOne();
    res.status(200).json({
      status: true,
      message: "Law data deleted successfully!",
    });
  } catch (error) {
    if (error.statusCode) {
      throw error;
    }
    error.message = "Server Error in law delete!";
    throw error;
  }
};

//Read Single Law
export const detailLaw = async (req, res) => {
  try {
    const law = await Law.findById(req.params.id).populate("hluttawId");
    if (!law) {
      const error = new Error("No law data found!");
      error.status = false;
      error.statusCode = 404;
      throw error;
    }
    // Increment view count
    law.viewCount += 1;
    law.viewRating = Math.min(5, law.viewCount / 50);
    await law.save();
    res.status(200).json({
      status: true,
      data: {
        id: law._id,
        lawNo: law.number,
        description: law.description,
        remark: law.remark,
        downloadUrl: law.downloadUrl,
        hluttawTime: law.hluttawId.time,
        viewCount: law.viewCount,
        ViewRating: law.viewRating,
        createdAt: moment(law.createdAt).format("DD-MM-YYYY"),
      },
    });
  } catch (error) {
    if (error.statusCode) {
      throw error;
    }
    error.message = "Server Error in law detail!";
    throw error;
  }
};

// Download law PDF + increment downloadCount
export const downloadLaw = async (req, res) => {
  try {
    await mongoIdValidaton(req.params.id);
    const law = await Law.findById(req.params.id);
    if (!law) {
      const error = new Error("No law data found!");
      error.status = false;
      error.statusCode = 404;
      throw error;
    }
    // Increment download count
    law.downloadCount += 1;
    await law.save();

    // Send file
    const filePath = path.join(process.cwd(), law.downloadUrl);
    if (!fs.existsSync(filePath)) {
      const error = new Error("file not found!");
      error.status = false;
      error.statusCode = 404;
      throw error;
    }
    res.download(filePath);
  } catch (error) {
    if (error.statusCode) {
      throw error;
    }
    error.message = "Server Error in download file!";
    throw error;
  }
};
