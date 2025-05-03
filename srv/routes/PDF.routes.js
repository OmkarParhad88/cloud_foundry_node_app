const express = require("express");
const PDFRoutes = express.Router();
const PDFController = require("../controllers/PDF.controller");
const qs = require("qs");
const fs = require("fs");
const passport = require('passport');
const xsenv = require('@sap/xsenv');
const { JWTStrategy } = require("@sap/xssec").v3;

let services;
if (process.env.VCAP_SERVICES) {
  services = xsenv.getServices({ uaa: 'ctc_srv-xsuaa' });
} else {
  const envData = JSON.parse(fs.readFileSync("./default-env.json", "utf8"));
  services = { uaa: envData.VCAP_SERVICES.xsuaa[0].credentials };
}

// const services = xsenv.getServices({ uaa: 'nodeuaa' });

passport.use(new JWTStrategy(services.uaa));

PDFRoutes.use(passport.initialize());
// app.use(passport.authenticate('JWT', { session: false }));

const checkAuth = passport.authenticate("JWT", { session: false });

PDFRoutes.get("/paycomponent", PDFController.getFOPayComponents);
PDFRoutes.get("/", PDFController.getBase);
PDFRoutes.get("/user", PDFController.getUser);
PDFRoutes.get("/companies", PDFController.getCompanies);
// PDFRoutes.get("/emppaycomponents", PDFController.getEmpPayComponents);
PDFRoutes.post("/pdf", PDFController.getEmpPayComponents);
PDFRoutes.get("/forms", PDFController.getForms);


module.exports = PDFRoutes;

