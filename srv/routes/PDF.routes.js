const express = require("express");
const PDFRoutes = express.Router();
const PDFController = require("../controllers/PDF.controller");

PDFRoutes.get("/", PDFController.getBase);
PDFRoutes.post("/json", PDFController.getCtcLetterJson);
PDFRoutes.post("/xml", PDFController.getCtcLetterXML);
PDFRoutes.post("/pdf", PDFController.getCTCLetterPDF);
["/json", "/xml", "/pdf"].forEach(route => {
  PDFRoutes.all(route, (req, res) => {
    res.status(405).send(`${req.method} method not allowed on ${route}`);
  });
});

module.exports = PDFRoutes;

