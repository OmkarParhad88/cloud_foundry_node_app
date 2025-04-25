const express = require("express");
const router = express.Router();
const SFController = require("../controllers/SF.controller");

router.get("/paycomponent", SFController.getFOPayComponents);
router.get("/", SFController.getBase);
router.get("/user", SFController.getUser);
router.get("/companies", SFController.getCompanies);
router.get("/emppaycomponents", SFController.getEmpPayComponents);


module.exports = { router, setAxios: SFController.setAxios };

