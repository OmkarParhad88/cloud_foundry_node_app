const express = require("express");
const router = express.Router();
const SFController = require("../controllers/SF.controller");

router.get("/prdcomponent", SFController.getFOPayComponents);
router.get("/", SFController.getBase);

module.exports = { router, setAxios: SFController.setAxios };

