import { tagsValidation, mongoIdValidaton } from "../helpers/validation.js";
import Tag from "../models/tags.model.js";


export const tagsList = async (req, res) => {
  try {
    const tagList = await Tag
      .find({}, "_id name shortName")
      .sort({ createdAt: -1 });
    if (tagList.length === 0) {
      const error = new Error("No tags found!");
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({
      status: true,
      message: "Tags retrieved successfully!",
      data: tagList,
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
    console.log(error.message);
    error.message = "Server Error in creating tag!";
    throw error;
  }
};

export const deleteTag = async (req, res) => {
  try {
    const { id } = req.params;
    await mongoIdValidaton(id);
    const deletedTag = await Tag.findByIdAndDelete(id);
    if (!deletedTag) {
      const error = new Error("Tag not found!");
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
export const updateTag = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, shortName } = req.body;
    await mongoIdValidaton(id);
    const tag = await Tag.findById(id);
    if (!tag) {
      const error = new Error("Tag not found!");
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
