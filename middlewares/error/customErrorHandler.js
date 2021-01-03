const CustomError = require("../../helpers/errors/CustomError")

const customErrorHandler = (err, req, res, next) => {
  let customError = err;
  //Tanımsız Hata yakalamak için console.log ile hata yazdırılıp aşağıdaki örneklerle kendi mesajımzıa çevirilebilir
console.log(err);
  if (err.name === "SyntaxError") {
    customError = new CustomError("Unexpected Syntax", 400);
  }
  if (err.name === "ValidationError") {
    customError = new CustomError(err.message, 400);
  }
  if (err.code === 11000) {
    //Duplicate Key Error
    customError = new CustomError("Duplicate Key Forund:Check Your Input")
  }
  if(err.name ==="TypeError"){
    customError = new CustomError("Data is not found:Check your Input")
  }

  res
    .status(customError.status || 500)
    .json({
      success: false,
      message: customError.message,

    })
}


module.exports = customErrorHandler;