const express = require("express");

const {
  getUserProfile,
  updateUserProfile,
  getUserPickupHistory,
  deleteUserAccount,
} = require("../controllers/userController");

const { protect } = require("../middleware/authMiddleware");

const upload = require(
  "../middleware/uploadMiddleware"
);

const {
  validateUserUpdate,
} = require(
  "../validations/userValidation"
);

const router = express.Router();


// ==========================================
// GET USER PROFILE
// ==========================================
router.get(
  "/profile",
  protect,
  getUserProfile
);


// ==========================================
// UPDATE USER PROFILE
// ==========================================
router.put(
  "/profile",
  protect,
  upload.single("profileImage"),
  validateUserUpdate,
  updateUserProfile
);


// ==========================================
// GET USER PICKUP HISTORY
// ==========================================
router.get(
  "/pickup-history",
  protect,
  getUserPickupHistory
);


// ==========================================
// DELETE USER ACCOUNT
// ==========================================
router.delete(
  "/delete-account",
  protect,
  deleteUserAccount
);


module.exports = router;