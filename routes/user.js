const express = require("express");
const router = express.Router();
const uid2 = require("uid2");
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");

const User = require("../models/User");

router.post("/user/sign_up", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.fields.email });

    if (user) {
      res.json({ message: "This email already has an account." });
    } else {
      if (req.fields.email && req.fields.password && req.fields.username) {
        const token = uid2(64);
        const salt = uid2(64);
        const hash = SHA256(req.fields.password + salt).toString(encBase64);
        const user = new User({
          email: req.fields.email,
          username: req.fields.username,
          token: token,
          salt: salt,
          hash: hash,
        });

        await user.save();

        res.json({
          _id: user._id,
          token: user.token,
          username: user.username,
        });
      } else {
        res.json({ error: "Something is missing" });
      }
    }
  } catch (error) {
    res.json({ message: error.message });
  }
});

router.post("/user/log_in", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.fields.email });
    if (user) {
      if (
        SHA256(req.fields.password + user.salt).toString(encBase64) ===
        user.hash
      ) {
        res.json({
          _id: user._id,
          token: user.token,
          username: user.username,
        });
      } else {
        res.status(401).json({ error: "Unauthorized" });
      }
    } else {
      res.json({ message: "User not found" });
    }
  } catch (error) {
    res.json({ message: error.message });
  }
});

module.exports = router;
