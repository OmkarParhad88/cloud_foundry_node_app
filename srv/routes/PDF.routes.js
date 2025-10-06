const express = require("express");
const PDFRoutes = express.Router();
const PDFController = require("../controllers/PDF.controller");

PDFRoutes.get("/", PDFController.getBase);
PDFRoutes.get("/json", PDFController.getCtcLetterJson);
PDFRoutes.get("/xml", PDFController.getCtcLetterXML);
PDFRoutes.get("/pdf", PDFController.getCTCLetterPDF);

module.exports = PDFRoutes;
