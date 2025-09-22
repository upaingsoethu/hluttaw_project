import {
  electionTypesValidation,
  mongoIdValidaton,
} from "../helpers/validation.js";
import ElectionTypes from "../models/electiontype.model.js";

export const electionsTypes = async (req, res) => {
  try {
    const electionsTypes = await ElectionTypes.find().sort({
      createdAt: -1,
    });
    if (electionsTypes.length === 0) {
      const error = new Error("No elections types found!");
      error.status = false;
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({
      status: true,
      message: "Elections types fetched successfully!",
      data: electionsTypes,
    });
  } catch (error) {
    if (error.statusCode) {
      throw error;
    }
    error.message = "Server Error in fetching elections types!";
    throw error;
  }
};

export const createElectionTypes = async (req, res) => {
  try {
    const { name, shortName , description} = req.body;
    await electionTypesValidation(name, shortName , description);
    const newElectionTypes = await ElectionTypes.create({
      name,
      shortName,
      description
    });
    res.status(201).json({
      status: true,
      message: "New election types created successfully!",
      data: newElectionTypes,
    });
  } catch (error) {
    if (error.statusCode) {
      throw error;
    }
    error.message = "Server Error in creating election types!";
    throw error;
  }
};

export const updateElectionTypes = async (req, res) => {
  try {
    const { name, shortName } = req.body;
    await mongoIdValidaton(req.params.id);
    const electionTypes = await ElectionTypes.findById(req.params.id);
    if (!electionTypes) {
      const error = new Error("Election Types not found!");
      error.status = false;
      error.statusCode = 400;
      throw error;
    }
    electionTypes.name = name || electionTypes.name;
    electionTypes.shortName =
      shortName || electionTypes.shortName;

    const updatedElectionTypes = await electionTypes.save();

    res.status(200).json({
      status: true,
      message: "Election types updated successfully!",
      data: updatedElectionTypes,
    });
  } catch (error) {
    if (error.statusCode) {
      throw error;
    }
    error.message = "Server Error in updating election types!";
    throw error;
  }
};

export const deleteElectionTypes = async (req, res) => {
  try {
    await mongoIdValidaton(req.params.id);
    const deletedElectionTypes = await ElectionTypes.findByIdAndDelete(
      req.params.id
    );
    if (!deletedElectionTypes) {
      const error = new Error("Election types not found!");
      error.status = false;
      error.statusCode = 400;
      throw error;
    }
    res
      .status(200)
      .json({ status: true, message: "Election types deleted successfully!" });
  } catch (error) {
    if (error.statusCode) {
      throw error;
    }
    error.message = "Server Error in deleting election types!";
    throw error;
  }
};
