const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

const getToken = (user) => {
    return jwt.sign({
        _id: user._id,
        name: user.name,
        email: user.email,
        password: user.password,
        isAdmin: user.isAdmin

    },
        config.JWT_SECRET, {
        expiresIn: '48h'
    }

    )
}
module.exports = getToken