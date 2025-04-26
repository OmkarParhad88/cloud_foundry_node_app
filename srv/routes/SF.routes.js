const express = require("express");
const SFRoutes = express.Router();
const SFController = require("../controllers/SF.controller");

SFRoutes.get("/paycomponent", SFController.getFOPayComponents);
SFRoutes.get("/", SFController.getBase);
SFRoutes.get("/user", SFController.getUser);
SFRoutes.get("/companies", SFController.getCompanies);
SFRoutes.get("/emppaycomponents", SFController.getEmpPayComponents);
 
module.exports =  SFRoutes;

