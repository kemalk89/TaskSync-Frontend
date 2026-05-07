var crypto = require("crypto");
var express = require("express");
var db = require("./../db");
const {
  isNullOrWhiteSpace,
  hashPassword,
  fetchUserByEmail,
} = require("./../utils");

var router = express.Router();

/**
 * This route creates a new user account.
 */
router.post("/signup", async (req, res) => {
  console.log("Try to signup new user...");

  if (!req.body) {
    console.log("No signup data provided");
    return res.status(400).send({ error: "No signup data provided" });
  }

  const { email, password } = req.body;

  if (isNullOrWhiteSpace(email) || isNullOrWhiteSpace(password)) {
    return res.status(400).send({ error: "Email or password cannot be empty" });
  }

  const hashedPasswordResult = await hashPassword(crypto, password);
  if (!hashedPasswordResult.success) {
    return res.status(400).send({ error: "Unknown" });
  }
  const foundUser = await fetchUserByEmail(db, email);
  const userExists = foundUser.success;
  if (userExists) {
    console.log("Signup failed because user already exists.");
    return res.status(400).send({ error: "Signup failed" });
  }

  const insertedUserResult = await insertUser(
    email,
    hashedPasswordResult.hashedPassword,
    hashedPasswordResult.salt,
  );

  if (!insertedUserResult.success) {
    console.log("Signup failed.", insertedUserResult.error);
    return res.status(400).send({ error: "Signup failed" });
  }

  return res.status(201).send({ message: "Signup successful" });
});

async function insertUser(email, hashedPassword, salt) {
  try {
    const result = await db
      .getPool()
      .query(
        'INSERT INTO "Users" ("Username", "Email", "HashedPassword", "Salt", "CreatedBy", "CreatedDate") VALUES ($1, $2, $3, $4, $5, $6) RETURNING "Id"',
        [email, email, hashedPassword, salt, 0, new Date()],
      );

    var user = {
      id: result.rows[0].id,
      email,
    };
    console.log("Signup successful.");

    return {
      success: true,
      data: user,
    };
  } catch (err) {
    console.error("Unable to insert user. Error: " + err);
    return {
      success: false,
      error: err,
    };
  }
}

module.exports = router;
