import { meetingValidation, mongoIdValidaton } from "../helpers/validation.js";
import Meeting from "../models/meeting.model.js";

export const meetingsList = async (req, res) => {
  try {
    const meetings = await Meeting.find().sort({ createdAt: -1 });
    if (meetings.length === 0) {
      const error = new Error("No meetings found!");
      error.status = false;
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({
      status: true,
      message: "Meetings list fetched successfully!",
      data: meetings,
    });
  } catch (error) {
    if (error.statusCode) {
      throw error;
    }
    error.message = "Server Error in fetching meetings!";
    throw error;
  }
};

export const createMeeting = async (req, res) => {
  try {
    const { name, shortName, description } = req.body;
    await meetingValidation(name, shortName, description);
    const newMeeting = await Meeting.create({ name, shortName, description });
    res.status(201).json({
      status: true,
      message: "Meeting created successfully!",
      data: newMeeting,
    });
  } catch (error) {
    if (error.statusCode) {
      throw error;
    }
    error.message = "Server Error in creating meeting!";
    throw error;
  }
};

export const updateMeeting = async (req, res) => {
  try {
    const { name, shortName, description } = req.body;
    await mongoIdValidaton(req.params.id);
    const meeting = await Meeting.findById(req.params.id);
    if (!meeting) {
      const error = new Error("Meeting not found!");
      error.status = false;
      error.statusCode = 400;
      throw error;
    }

    meeting.name = name || meeting.name;
    meeting.shortName = shortName || meeting.shortName;
    meeting.description = description || meeting.description;

    const updatedMeeting = await meeting.save();

    res.status(200).json({
      status: true,
      message: "Meeting updated successfully!",
      data: updatedMeeting,
    });
  } catch (error) {
    if (error.statusCode) {
      throw error;
    }
    error.message = "Server Error in updating meetings!";
    throw error;
  }
};

export const deleteMeeting = async (req, res) => {
  try {
    await mongoIdValidaton(req.params.id);
    const deletedMeeting = await Meeting.findByIdAndDelete(req.params.id);
    if (!deletedMeeting) {
      const error = new Error("Meeting not found!");
      error.status = false;
      error.statusCode = 400;
      throw error;
    }
    res
      .status(200)
      .json({ status: true, message: "Meeting deleted successfully!" });
  } catch (error) {
    if (error.statusCode) {
      throw error;
    }
    error.message = "Server Error in deleting meeting!";
    throw error;
  }
};
