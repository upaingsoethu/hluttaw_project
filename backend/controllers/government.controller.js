import {
  governmentValidation,
  mongoIdValidaton,
} from "../helpers/validation.js";
import Government from "../models/government.model.js";

export const departmentsList = async (req, res) => {
  try {
    const departments = await Government.find().sort({
      createdAt: -1,
    });
    if (departments.length === 0) {
      const error = new Error("No departments found!");
      error.status = false;
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({
      status: true,
      message: "Department data fetched successfully!",
      data: departments,
    });
  } catch (error) {
    if (error.statusCode) {
      throw error;
    }
    error.message = "Server Error in fetching departments!";
    throw error;
  }
};

export const createDepartment = async (req, res) => {
  try {
    const { departmentName, departmentShortName, governmentName } = req.body;
    await governmentValidation(
      departmentName,
      departmentShortName,
      governmentName
    );
    const newGovernment = await Government.create({
      departmentName,
      departmentShortName,
      governmentName
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
    error.message = "Server Error in creating departments!";
    throw error;
  }
};

export const updateDepartment = async (req, res) => {
  try {
    const { departmentName, departmentShortName, governmentName } = req.body;
    await mongoIdValidaton(req.params.id);
    const government = await Government.findById(req.params.id);
    if (!government) {
      const error = new Error("Department not found!");
      error.status = false;
      error.statusCode = 400;
      throw error;
    }
    government.departmentName = departmentName || government.departmentName;
    government.departmentShortName = departmentShortName || government.departmentShortName;
    government.governmentName = governmentName || government.governmentName;

    const updatedGovernment = await government.save();

    res.status(200).json({
      status: true,
      message: "Department updated successfully!",
      data: updatedGovernment,
    });
  } catch (error) {
    if (error.statusCode) {
      throw error;
    }
    error.message = "Server Error in updating department!";
    throw error;
  }
};

export const deleteDepartment = async (req, res) => {
  try {
    await mongoIdValidaton(req.params.id);
    const deletedDepartment = await Government.findByIdAndDelete(req.params.id);
    if (!deletedDepartment) {
      const error = new Error("Department not found!");
      error.status = false;
      error.statusCode = 400;
      throw error;
    }
    res
      .status(200)
      .json({ status: true, message: "Department deleted successfully!" });
  } catch (error) {
    if (error.statusCode) {
      throw error;
    }
    error.message = "Server Error in deleting department!";
    throw error;
  }
};
