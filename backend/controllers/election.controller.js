import {
  electionValidation,
  mongoIdValidaton,
} from "../helpers/validation.js";
import Election from "../models/election.model.js";

export const electionsList = async (req, res) => {
  try {
    const elections = await Election.find({}, "_id electionName electionShortName").sort({
      createdAt: -1,
    });
    if (elections.length === 0) {
      const error = new Error("No elections found!");
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({
      status: true,
      message: "Elections retrieved successfully!",
      data: elections,
    });
  } catch (error) {
    if (error.statusCode) {
      throw error;
    }
    error.message = "Server Error in fetching elections!";
    throw error;
  }
};

export const createElection = async (req, res) => {
  try {
    const { electionName, electionShortName } = req.body;
    await electionValidation(electionName, electionShortName);
    const newElection = await Election.create({
      electionName,
      electionShortName,
    });
    res.status(201).json({
      status: true,
      message: "Election created successfully!",
      data: newElection,
    });
  } catch (error) {
    if (error.statusCode) {
      throw error;
    }
    console.log(error.message);
    error.message = "Server Error in creating election!";
    throw error;
  }
};

export const updateElection = async (req, res) => {
  try {
    const { electionName, electionShortName } = req.body;
    await mongoIdValidaton(req.params.id);
    const election = await Election.findById(req.params.id);
    if (!election) {
      const error = new Error("Election not found!");
      error.statusCode = 400;
      throw error;
    }
    election.electionName = electionName || election.electionName;
    election.electionShortName = electionShortName || election.electionShortName;

    const updatedElection = await election.save();

    res.status(200).json({
      status: true,
      message: "Election updated successfully!",
      data: updatedElection,
    });
  } catch (error) {
    if (error.statusCode) {
      throw error;
    }
    error.message = "Server Error in updating election!";
    throw error;
  }
};

export const deleteElection = async (req, res) => {
  try {
    await mongoIdValidaton(req.params.id);
    const deletedElection = await Election.findByIdAndDelete(req.params.id);
    if (!deletedElection) {
      const error = new Error("Election not found!");
      error.statusCode = 400;
      throw error;
    }
    res
      .status(200)
      .json({ status: true, message: "Election deleted successfully!" });
  } catch (error) {
    if (error.statusCode) {
      throw error;
    }
    error.message = "Server Error in deleting election!";
    throw error;
  }
};
