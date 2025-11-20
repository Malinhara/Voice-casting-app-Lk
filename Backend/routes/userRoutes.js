const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// Signup
router.post("/", userController.createUser);

// Verify Code
router.post("/verify", userController.verifyUser);

// Login
router.post("/login", userController.loginUser);

// Get user
router.get("/:id", userController.getUserById);

router.put("/:id", userController.updateUserById);


router.get("/", userController.getAllUsers);

router.put("/:id/status", userController.updateUserStatus);

router.delete("/:id", userController.deleteUserById);

module.exports = router;
