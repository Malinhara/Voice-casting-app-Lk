const express = require("express");
const router = express.Router();
const fileController = require("../controllers/fileController");

// POST - Save file
router.post("/", fileController.saveFile);

// GET - All files
router.get("/", fileController.getFiles);

// GET - Files for a specific user
router.get("/:userId", fileController.getFilesForUser);

// DELETE - Remove a specific image URL
router.delete("/delete-image", fileController.deleteFileUrl);

module.exports = router;
