import { committeeValidation, mongoIdValidaton } from "../helpers/validation.js";
import  Committee  from "../models/committee.model.js";


export const committesList = async (req, res) => {
  try {
    const committees = await Committee
      .find({}, "_id committeeName committeeShortName")
      .sort({ createdAt: -1 });
    if (committees.length === 0) {
      const error = new Error("No committees found!");
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({
      status: true,
      message: "Committees retrieved successfully!",
      data: committees,
    });
  } catch (error) {
    if (error.statusCode) {
      throw error;
    }
    error.message = "Server Error in fetching committee!";
    throw error;
  }
};

export const createCommittee = async (req, res) => {
  try {
    const { committeeName, committeeShortName } = req.body;
    await committeeValidation(committeeName , committeeShortName);
    const newCommittee = await Committee.create({
      committeeName,
      committeeShortName,
    });
    res.status(201).json({
      status: true,
      message: "Committee created successfully!",
      data: newCommittee,
    });
  } catch (error) {
    if (error.statusCode) {
      throw error;
    }
    console.log(error.message);
    error.message = "Server Error in creating committee!";
    throw error;
  }
};

export const updateCommittee = async (req, res) => {
  try {
    const { committeeName, committeeShortName } = req.body;
    await mongoIdValidaton(req.params.id);
    const committee = await Committee.findById(req.params.id);
    if (!committee) {
      const error = new Error("Committee not found!");
      error.statusCode = 400;
      throw error;
    }
    committee.committeeName = committeeName || committee.committeeName;
    committee.committeeShortName =
      committeeShortName || committee.committeeShortName;

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

