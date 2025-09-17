import { governmentValidation, mongoIdValidaton } from "../helpers/validation.js";
import Government from "../models/government.model.js";

export const governmentList = async (req, res) => {
  try {
    const governments = await Government.find(
      {},
      "_id governmentName governmentShortName"
    ).sort({
      createdAt: -1,
    });
    if (governments.length === 0) {
      const error = new Error("No governments data found!");
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({
      status: true,
      message: "Governments data retrieved successfully!",
      data: governments,
    });
  } catch (error) {
    if (error.statusCode) {
      throw error;
    }
    error.message = "Server Error in fetching governments!";
    throw error;
  }
};

export const createGovernment = async (req, res) => {
  try {
    const { governmentName, governmentShortName } = req.body;
    await governmentValidation(governmentName, governmentShortName);
    const newGovernment = await Government.create({
      governmentName,
      governmentShortName,
    });
    res.status(201).json({
      status: true,
      message: "Government created successfully!",
      data: newGovernment,
    });
  } catch (error) {
    if (error.statusCode) {
      throw error;
    }
    console.log(error.message);
    error.message = "Server Error in creating government!";
    throw error;
  }
};

export const updateGovernment = async (req, res) => {
  try {
    const { governmentName, governmentShortName } = req.body;
    await mongoIdValidaton(req.params.id);
    const government = await Government.findById(req.params.id);
    if (!government) {
      const error = new Error("Government not found!");
      error.statusCode = 400;
      throw error;
    }
    government.governmentName = governmentName || government.governmentName;
    government.governmentShortName = governmentShortName || government.governmentShortName;

    const updatedGovernment = await government.save();

    res.status(200).json({
      status: true,
      message: "Government updated successfully!",
      data: updatedGovernment,
    });
  } catch (error) {
    if (error.statusCode) {
      throw error;
    }
    error.message = "Server Error in updating government!";
    throw error;
  }
};

export const deleteGovernment = async (req, res) => {
  try {
    await mongoIdValidaton(req.params.id);
    const deletedGovernment = await Government.findByIdAndDelete(req.params.id);
    if (!deletedGovernment) {
      const error = new Error("Government not found!");
      error.statusCode = 400;
      throw error;
    }
    res
      .status(200)
      .json({ status: true, message: "Government deleted successfully!" });
  } catch (error) {
    if (error.statusCode) {
      throw error;
    }
    error.message = "Server Error in deleting government!";
    throw error;
  }
};
