// controllers/fileController.js
const fileService = require("../services/fileService");

const saveFile = async (req, res) => {
  try {
    const { userId, imageUrl, audioUrl } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    // Save or append files
    const savedFile = await fileService.saveFile({ userId, imageUrl, audioUrl });

    res.status(201).json({ message: "File saved successfully", file: savedFile });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


const deleteFileUrl = async (req, res) => {
  try {
    const { userId, url, type } = req.body; // type = 'image' or 'audio'

    if (!userId || !url || !type) {
      return res.status(400).json({ message: "userId, url, and type are required" });
    }

    // Determine which field to pull from
    const field = type === "image" ? "imageUrl" : "audioUrl";

    const updatedUser = await fileService.deleteFileUrl(
      userId,
      url,
      field
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Optional: delete document if both arrays are empty
    if (updatedUser.imageUrl.length === 0 && updatedUser.audioUrl.length === 0) {
      await File.findOneAndDelete({ userId });
      return res
        .status(200)
        .json({ message: "URL removed and document deleted" });
    }

    res.status(200).json({ message: "URL removed successfully", data: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};

const getFiles = async (req, res) => {
  try {
    const files = await fileService.getAllFiles();
    res.json(files);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const getFilesForUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const files = await fileService.getFilesByUserId(userId);
    res.json(files);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports = {
  saveFile,
  getFiles,
  deleteFileUrl,
  getFilesForUser,
};
