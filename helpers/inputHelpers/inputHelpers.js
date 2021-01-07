const bcrypt = require("bcryptjs");

const valideUserInput = (email, password) => {
  return email && password;
};

// Password ve Hashed pasword karşılaştırma doğrulaması
const comparePassword = (password, hashedPassword) => {
  return bcrypt.compareSync(password, hashedPassword);
};

module.exports = { valideUserInput, comparePassword };
