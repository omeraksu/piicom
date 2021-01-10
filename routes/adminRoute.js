const express = require("express");

const {
  getAccessToRoute,
  getAdminAccess,
} = require("../middlewares/authorization/auth");

const router = express.Router();

router.get("/adminPanel", getAccessToRoute,getAdminAccess,(req, res, next) => {
  res.status(200).json({
    success: true,
    message: "Admin Page",
  });
});

module.exports = router;
