/**
 * Indicates whether given value is null, empty, undefined, or consists only of white-space characters.
 */
export const isNullOrWhiteSpace = (value) => {
  if (value === null || value === undefined) {
    return true;
  }

  return value.toString().trim().length === 0;
};

export const verifyUserPassword = (crypto, user, password) => {
  return new Promise((resolve, reject) => {
    crypto.pbkdf2(
      password,
      user.Salt,
      310000,
      32,
      "sha256",
      function (err, hashedPassword) {
        if (err) {
          return reject({
            success: false,
            error: err,
          });
        }
        if (!crypto.timingSafeEqual(user.HashedPassword, hashedPassword)) {
          return reject({
            success: false,
            error: "Incorrect username or password.",
          });
        }
        return resolve({
          success: true,
        });
      },
    );
  });
};

export const fetchUserByEmail = (db, email) => {
  return new Promise((resolve, reject) => {
    db.getPool().query(
      'SELECT "Id", "Email", "Username", "HashedPassword", "Salt" FROM "Users" WHERE "Email" = $1',
      [email],
      (err, rowObj) => {
        if (err) {
          console.error(err);
          return reject({
            success: false,
            error: err,
          });
        }

        if (!rowObj || rowObj.rows.length === 0) {
          console.warn("Incorrect username or password.");
          return reject({
            success: false,
            error: "Incorrect username or password.",
          });
        }

        const row = rowObj.rows.at(0);
        return resolve({
          success: true,
          data: row,
        });
      },
    );
  });
};

export const hashPassword = (crypto, password) => {
  return new Promise((resolve, reject) => {
    var salt = crypto.randomBytes(16);
    crypto.pbkdf2(
      password,
      salt,
      310000,
      32,
      "sha256",
      async function (err, hashedPassword) {
        if (err) {
          return reject({
            success: false,
            error: err,
          });
        }

        return resolve({
          success: true,
          salt,
          hashedPassword,
        });
      },
    );
  });
};
