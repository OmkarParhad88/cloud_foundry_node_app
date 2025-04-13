const express = require("express");
const router = express.Router();
const AdobeController = require("../controllers/Adobe.controller");

router.get("/adsapi", AdobeController.getForms);

module.exports = { router, setAxios: AdobeController.setAxios };
