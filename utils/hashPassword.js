const crypto = require('crypto');

// ---------------------------------------------------------------------------
// This file is used to hash the password
// uses the crypto module to hash the password
// ---------------------------------------------------------------------------

function hashPassword(password) {
  return crypto.createHash("sha256").update(password).digest("hex");
}

module.exports = hashPassword;