import path from "path";
import fs from "fs";
import { partyValidation, mongoIdValidaton } from "../helpers/validation.js";
import Party from "../models/party.model.js";

export const partiesList = async (req, res) => {
  try {
    const parties = await Party.find().sort({ createdAt: -1 });
    if (parties.length === 0) {
      const error = new Error("No parties found!");
      error.status = false;
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({
      status: true,
      message: "Parties list fetched successfully!",
      data: parties,
    });
  } catch (error) {
    if (error.statusCode) {
      throw error;
    }
    error.message = "Server Error in fetching parties list!";
    throw error;
  }
};

export const createParty = async (req, res) => {
  try {
    const file = req.file; //file from multer middleware
    if (!file) {
      const error = new Error("Party logo is required!");
      error.status = false;
      error.statusCode = 400;
      throw error;
    }
    const { name, shortName, description } = req.body;
     await partyValidation(name, shortName ,file);
    

    const logoUrl = `/uploads/Party/${file.filename}`;
    const newParty = await Party.create({
      name,
      shortName,
      description,
      logoUrl,
    });
    res.status(201).json({
      status: true,
      message: "Party created successfully!",
      data: newParty,
    });
  } catch (error) {
    if (error.statusCode) {
      throw error;
    }
    error.message = "Server Error in creating party!";
    throw error;
  }
};

export const updateParty = async (req, res) => {
  try {
    const file = req.file; // file from multer middleware
    const { name, shortName, description } = req.body;
    await mongoIdValidaton(req.params.id);
    const party = await Party.findById(req.params.id);
    if (!party) {
      const error = new Error("Party not found!");
      error.status = false;
      error.statusCode = 400;
      throw error;
    }

    if (file && party.logoUrl) {
      const oldLogo = path.join(process.cwd(), party.logoUrl);
      if (fs.existsSync(oldLogo)) fs.unlinkSync(oldLogo);
      party.logoUrl = `/uploads/Party/${file.filename}`;
    }

    party.name = name || party.name;
    party.shortName = shortName || party.shortName;
    party.description = description || party.description;

    const updatedParty = await party.save();

    res.status(200).json({
      status: true,
      message: "Party updated successfully!",
      data: updatedParty,
    });
  } catch (error) {
    if (error.statusCode) {
      throw error;
    }
    error.message = "Server Error in updating parties!";
    throw error;
  }
};

export const deleteParty = async (req, res) => {
  try {
    await mongoIdValidaton(req.params.id);
    const party = await Party.findByIdAndDelete(req.params.id);
    if (!party) {
      const error = new Error("Party not found!");
      error.status = false;
      error.statusCode = 400;
      throw error;
    }
    if (party.logoUrl) {
      const oldLogo = path.join(process.cwd(), party.logoUrl);
      if (fs.existsSync(oldLogo)) fs.unlinkSync(oldLogo);
    }
    res
      .status(200)
      .json({ status: true, message: "Party deleted successfully!" });
  } catch (error) {
    if (error.statusCode) {
      throw error;
    }
    error.message = "Server Error in deleting party!";
    throw error;
  }
};
