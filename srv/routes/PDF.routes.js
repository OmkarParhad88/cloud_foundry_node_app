const express = require("express");
const PDFRoutes = express.Router();
const PDFController = require("../controllers/PDF.controller");

PDFRoutes.get("/paycomponent", PDFController.getFOPayComponents);
PDFRoutes.get("/", PDFController.getBase);
PDFRoutes.get("/user", PDFController.getUser);
PDFRoutes.get("/companies", PDFController.getCompanies);
PDFRoutes.post("/pdf", PDFController.getEmpPayComponents);
PDFRoutes.get("/forms", PDFController.getForms);

module.exports = PDFRoutes;

