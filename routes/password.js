const express = require("express");

const router = express.Router();

const passwordController = require("../controllers/password");

router.post("/forgotpassword", passwordController.sendEmail);
router.post("/resetpassword/:id", passwordController.resetPassword);

module.exports = router;
