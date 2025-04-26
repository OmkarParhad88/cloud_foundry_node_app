const express = require("express");
const AdobeRoutes = express.Router();
const AdobeController = require("../controllers/Adobe.controller");

AdobeRoutes.get("/forms", AdobeController.getForms); 
AdobeRoutes.get("/formtemplate", AdobeController.getFormsTemplate); 
AdobeRoutes.get("/ctcletter", AdobeController.getCTCLetter); 

module.exports = AdobeRoutes;
