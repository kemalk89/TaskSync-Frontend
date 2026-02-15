var express = require("express");
var crypto = require("crypto");
var db = require("./../db");
const {
  verifyUserPassword,
  fetchUserByEmail,
  hashPassword,
  isNullOrWhiteSpace,
} = require("../utils");

var router = express.Router();

/**
 * This route resets the users password.
 */
router.post("/password/reset", async (req, res) => {
  const { email, oldPassword, newPasword } = req.body;
  if (
    isNullOrWhiteSpace(email) ||
    isNullOrWhiteSpace(oldPassword) ||
    isNullOrWhiteSpace(newPasword)
  ) {
    return res.status(400).send({ error: "Invalid input" });
  }

  const userResult = await fetchUserByEmail(db, email);
  if (!userResult.success) {
    console.debug("Password Reset failed: No user found");
    return res.status(400).send({ error: "Reset password failed" });
  }

  const verifyUserPasswordResult = await verifyUserPassword(
    userResult.data,
    oldPassword,
  );
  if (!verifyUserPasswordResult.success) {
    console.debug("Password Reset failed: Wrong credentials");
    return res.status(400).send({ error: "Reset password failed" });
  }

  const hashedPasswordResult = await hashPassword(crypto, newPasword);
  if (!hashedPasswordResult.success) {
    console.debug("Password Reset failed: Wrong credentials");
    return res.status(400).send({ error: "Reset password failed" });
  }

  const updateUserPasswordResult = await updateUserPassword(
    email,
    hashedPasswordResult.hashedPassword,
    hashedPasswordResult.salt,
  );

  if (!updateUserPasswordResult.success) {
    console.debug("Could not update password in database");
    return res.status(400).send({ error: "Reset password failed" });
  }

  return res.status(200).send({ message: "Password reset successful" });
});

async function updateUserPassword(email, hashedPassword, salt) {
  try {
    const result = await db
      .getPool()
      .query(
        "UPDATE Users SET HashedPassword = $1, Salt = $2 WHERE Email= $3",
        [hashedPassword, salt, email],
      );

    return {
      success: true,
    };
  } catch (err) {
    return {
      success: false,
      error: err,
    };
  }
}
