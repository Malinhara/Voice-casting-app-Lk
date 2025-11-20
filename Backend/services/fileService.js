// services/fileService.js
const File = require("../models/fileModel");

const saveFile = async ({ userId, imageUrl, audioUrl }) => {
  // Find existing user document
  let userFiles = await File.findOne({ userId });

  if (!userFiles) {
    // If user has no document yet, create one
    userFiles = new File({ userId, imageUrl: [], audioUrl: [] });
  }

  // Append new files if provided
  if (imageUrl) userFiles.imageUrl.push(imageUrl);
  if (audioUrl) userFiles.audioUrl.push(audioUrl);

  return await userFiles.save();
};

const getAllFiles = async () => {
  return await File.find().sort({ uploadedAt: -1 });
};

const deleteFileUrl = async (userId, url, field) => {
  const updatedUser = await File.findOneAndUpdate(
    { userId },
    { $pull: { [field]: url } },
    { new: true }
  );

  // Delete document if both arrays are empty
  if (updatedUser && updatedUser.imageUrl.length === 0 && updatedUser.audioUrl.length === 0) {
    await File.findOneAndDelete({ userId });
    return null;
  }

  return updatedUser;
};


const getFilesByUserId = async (userId) => {
  return await File.findOne({ userId }).sort({ uploadedAt: -1 });
};


module.exports = {
  saveFile,
  getAllFiles,
  deleteFileUrl,
  getFilesByUserId,
};
