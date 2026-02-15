var crypto = require("crypto");
var express = require("express");
var db = require("./../db");
const { isNullOrWhiteSpace, hashPassword } = require("./../utils");

var router = express.Router();

/**
 * This route creates a new user account.
 */
router.post("/signup", async (req, res) => {
  console.log("Try to signup new user...");
  const { username, password } = req.body;

  if (isNullOrWhiteSpace(username) || isNullOrWhiteSpace(password)) {
    return res
      .status(400)
      .send({ error: "Username or password cannot be empty" });
  }

  const hashedPasswordResult = await hashPassword(crypto, password);
  if (!hashedPasswordResult.success) {
    console.log("Signup failed #1.", hashedPasswordResult.error);
    return res.status(400).send();
  }

  const insertedUserResult = await insertUser(
    username,
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
        'INSERT INTO "Users" ("Email", "HashedPassword", "Salt", "CreatedBy", "CreatedDate") VALUES ($1, $2, $3, $4, $5) RETURNING "Id"',
        [email, hashedPassword, salt, 0, new Date()],
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
    return {
      success: false,
      error: err,
    };
  }
}

module.exports = router;
