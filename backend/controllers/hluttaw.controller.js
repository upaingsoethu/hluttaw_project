import {
  hluttawValidation,
  mongoIdValidaton,
} from "../helpers/validation.js";
import Hluttaw from "../models/hluttaw.model.js";

export const hluttawList = async (req, res) => {
  try {
    const hluttaws = await Hluttaw.find().sort({createdAt: -1});
    if (hluttaws.length === 0) {
      const error = new Error("No hluttaws found!");
      error.status = false;
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({
      status: true,
      message: "Hluttaws data fetch successfully!",
      data: hluttaws,
    });
  } catch (error) {
    if (error.statusCode) {
      throw error;
    }
    error.message = "Server Error in fetching hluttaws!";
    throw error;
  }
};

export const createHluttaw = async (req, res) => {
  try {
    const { time, shortTime , period } = req.body;
    await hluttawValidation(time, shortTime , period);
    const newHluttaw = await Hluttaw.create({
      time,
      shortTime,
      period
    });
    res.status(201).json({
      status: true,
      message: "New Hluttaw created successfully!",
      data: newHluttaw,
    });
  } catch (error) {
    if (error.statusCode) {
      throw error;
    }
    console.log(error.message);
    error.message = "Server Error in creating hluttaw!";
    throw error;
  }
};

export const updateHluttaw = async (req, res) => {
  try {
    const { time, shortTime , period } = req.body;
    await mongoIdValidaton(req.params.id);
    const hluttaw = await Hluttaw.findById(req.params.id);
    if (!hluttaw) {
      const error = new Error("Hluttaw not found!");
      error.status = false;
      error.statusCode = 400;
      throw error;
    }
    hluttaw.time = time || hluttaw.time;
    hluttaw.shortTime = shortTime || hluttaw.shortTime;
    hluttaw.period = period || hluttaw.period;

    const updatedHluttaw = await hluttaw.save();

    res.status(200).json({
      status: true,
      message: "Hluttaw updated successfully!",
      data: updatedHluttaw,
    });
  } catch (error) {
    if (error.statusCode) {
      throw error;
    }
    error.message = "Server Error in updating hluttaw!";
    throw error;
  }
};

export const deleteHluttaw = async (req, res) => {
  try {
    await mongoIdValidaton(req.params.id);
    const deletedHluttaw = await Hluttaw.findByIdAndDelete(req.params.id);
    if (!deletedHluttaw) {
      const error = new Error("Hluttaw not found!");
      error.status = false;
      error.statusCode = 400;
      throw error;
    }
    res
      .status(200)
      .json({ status: true, message: "Hluttaw deleted successfully!" });
  } catch (error) {
    if (error.statusCode) {
      throw error;
    }
    error.message = "Server Error in deleting hluttaw!";
    throw error;
  }
};
