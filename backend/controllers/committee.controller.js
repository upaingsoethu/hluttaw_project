import moment from "moment/moment.js";
import {
  committeeValidation,
  mongoIdValidaton,
} from "../helpers/validation.js";
import Committee from "../models/committee.model.js";
moment.locale("my");

export const committesList = async (req, res) => {
  try {
    const committees = await Committee.find().populate("hluttawId").sort({ createdAt: -1 });
    
    if (committees.length === 0) {
      const error = new Error("No committees found!");
      error.status = false;
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({
      status: true,
      message: "Committees list retrieved successfully!",
      data: committees.map(committee=>{
       return {
         id: committee._id,
         name: committee.name,
         shortName: committee.shortName,
         hluttawTime: committee.hluttawId.hluttawTime
       };
      })
    });
  } catch (error) {
    if (error.statusCode) {
      throw error;
    }
    error.message = "Server Error in fetching committees list!";
    throw error;
  }
};

export const createCommittee = async (req, res) => {
  try {
    const { hluttawId, name, shortName } = req.body;
    await committeeValidation(hluttawId, name, shortName);
    const newCommittee = await Committee.create({
      name,
      shortName,
      hluttawId,
    });
    res.status(201).json({
      status: true,
      message: "New Committee created successfully!",
      data: newCommittee,
    });
  } catch (error) {
    if (error.statusCode) {
      throw error;
    }
    error.message = "Server Error in creating committee!";
    throw error;
  }
};

export const updateCommittee = async (req, res) => {
  try {
    const { hluttawId, name, shortName } = req.body;
    await mongoIdValidaton(req.params.id);
    const committee = await Committee.findById(req.params.id);
    if (!committee) {
      const error = new Error("Committee not found!");
      error.status = false;
      error.statusCode = 400;
      throw error;
    }
    committee.hluttawId = hluttawId || committee.hluttawId;
    committee.name = name || committee.name;
    committee.shortName = shortName || committee.shortName;

    const updatedCommittee = await committee.save();

    res.status(200).json({
      status: true,
      message: "Committee updated successfully!",
      data: updatedCommittee,
    });
  } catch (error) {
    if (error.statusCode) {
      throw error;
    }
    error.message = "Server Error in updating committee!";
    throw error;
  }
};

export const deleteCommittee = async (req, res) => {
  try {
    await mongoIdValidaton(req.params.id);
    const deletedCommittee = await Committee.findByIdAndDelete(req.params.id);
    if (!deletedCommittee) {
      const error = new Error("Committee not found!");
      error.status = false;
      error.statusCode = 400;
      throw error;
    }
    res
      .status(200)
      .json({ status: true, message: "Committee deleted successfully!" });
  } catch (error) {
    if (error.statusCode) {
      throw error;
    }
    error.message = "Server Error in deleting committee!";
    throw error;
  }
};
