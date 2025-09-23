import { tagsValidation, mongoIdValidaton } from "../helpers/validation.js";
import Tag from "../models/tag.model.js";

export const tagsList = async (req, res) => {
  try {
    const tags = await Tag.find().sort({ createdAt: -1 });
    if (tags.length === 0) {
      const error = new Error("No tags found!");
      error.status = false;
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({
      status: true,
      message: "Tags list fetched successfully!",
      data: tags,
    });
  } catch (error) {
    if (error.statusCode) {
      throw error;
    }
    error.message = "Server Error in fetching tags!";
    throw error;
  }
};

export const createTag = async (req, res) => {
  try {
    const { name, shortName } = req.body;
    await tagsValidation(name, shortName);
    const newTag = await Tag.create({ name, shortName });
    res.status(201).json({
      status: true,
      message: "Tag created successfully!",
      data: newTag,
    });
  } catch (error) {
    if (error.statusCode) {
      throw error;
    }
    error.message = "Server Error in creating tag!";
    throw error;
  }
};

export const updateTag = async (req, res) => {
  try {
    const { name, shortName } = req.body;
    await mongoIdValidaton(req.params.id);
    const tag = await Tag.findById(req.params.id);
    if (!tag) {
      const error = new Error("Tag not found!");
      error.status = false;
      error.statusCode = 400;
      throw error;
    }

    tag.name = name || tag.name;
    tag.shortName = shortName || tag.shortName;

    const updatedTag = await tag.save();

    res.status(200).json({
      status: true,
      message: "Tag updated successfully!",
      data: updatedTag,
    });
  } catch (error) {
    if (error.statusCode) {
      throw error;
    }
    error.message = "Server Error in updating tags!";
    throw error;
  }
};

export const deleteTag = async (req, res) => {
  try {
    await mongoIdValidaton(req.params.id);
    const deletedTag = await Tag.findByIdAndDelete(req.params.id);
    if (!deletedTag) {
      const error = new Error("Tag not found!");
      error.status = false;
      error.statusCode = 400;
      throw error;
    }
    res
      .status(200)
      .json({ status: true, message: "Tag deleted successfully!" });
  } catch (error) {
    if (error.statusCode) {
      throw error;
    }
    error.message = "Server Error in deleting tag!";
    throw error;
  }
};
