const express = require("express");
const { generateAIContent } = require("../controllers/aiController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/generate", protect, generateAIContent);

module.exports = router;
