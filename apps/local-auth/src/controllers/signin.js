var express = require("express");
var crypto = require("crypto");
var jwt = require("jsonwebtoken");

var db = require("./../db");
const { verifyUserPassword, fetchUserByEmail } = require("../utils");

var router = express.Router();

/**
 * This route authenticates the user by verifying a username and password.
 * It will also generate a JWT.
 */
router.post("/login/password", async (req, res) => {
  console.log("Attempt to login...");

  const userResult = await fetchUserByEmail(db, req.body.username);
  if (!userResult.success) {
    return res.status(401).send("Wrong credentials");
  }

  const pwVerificationResult = await verifyUserPassword(
    crypto,
    userResult.data,
    req.body.password,
  );
  if (!pwVerificationResult.success) {
    console.log("Password verification failed...");
    return res.status(401).send("Wrong credentials");
  }

  // Synchronous Sign with default (HMAC SHA256)
  const accessToken = jwt.sign(
    {
      iss: "http://localhost:3002",
      id: userResult.data.Id,
      username: userResult.data.Username,
      email: userResult.data.Email,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: 60 * 60,
    },
  );

  return res.status(200).send({
    id: userResult.data.Id,
    username: userResult.data.Username,
    email: userResult.data.Email,
    access_token: accessToken,
  });
});

module.exports = router;
