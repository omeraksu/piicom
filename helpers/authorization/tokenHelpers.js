const sendJwtToClient = (user, res) => {
  //Generate JWT
  const token = user.generateJwtFromUser();
  const { JWT_COOKIE, NODE_ENV } = process.env;
  return (
    res
      .status(200)
      .cookie("access_token", token, {
        httpOnly: true,
        expires: new Date(Date.now() + parseInt(JWT_COOKIE) * 1000),
        secure: NODE_ENV === "development" ? false : true,
      })

      //Response
      .json({
        success: true,
        access_token: token,
        data: {
          name: user.name,
          email: user.email,
          id: user.id,
        },
      })
  );
};

// Eğer token var ise
const isTokenIncluded = (req) => {
  return (
    req.headers.authorization && req.headers.authorization.startsWith("Bearer:")
  );
};

// Mongo'ya Bearer: {{access_token}} yazılır.Split ile bir boşluk verilir Bearer den sonra 1 boşluk için Array olarak 1 ci değer olan access token alınır.
const getAccessTokenFromHeader = (req) => {
  const authorization = req.headers.authorization;
  const access_token = authorization.split(" ")[1];
  return access_token;
};

module.exports = { sendJwtToClient, isTokenIncluded, getAccessTokenFromHeader };
