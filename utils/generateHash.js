const crypto = require('crypto');

function hashPassword(password) {
  return crypto.createHash("sha256").update(password).digest("hex");
}

// Example usage
const password = "admin123"; // Change this to your desired password
const hashedPassword = hashPassword(password);

console.log("Original Password:", password);
console.log("Hashed Password:", hashedPassword); 