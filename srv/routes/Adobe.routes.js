const express = require("express");
const router = express.Router();
const AdobeController = require("../controllers/Adobe.controller");

router.get("/forms", AdobeController.getForms); 
router.get("/formtemplate", AdobeController.getFormsTemplate); 
router.get("/ctcletter", AdobeController.getCTCLetter); 

module.exports = { router, setAxios: AdobeController.setAxios };
