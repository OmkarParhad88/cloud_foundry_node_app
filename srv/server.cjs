
require("dotenv").config({ path: "default-env.json" });
const express = require("express");
const { BasicAuthAxios, OAuth2Axios } = require("./config/destinations.config")
const PDFRoutes = require("./routes/PDF.routes");
const Sf_Api = require("./apis/Sf_Api");
const Adobe_Api = require("./apis/Adobe_Api");
const fs = require("fs");
const passport = require('passport');
const xsenv = require('@sap/xsenv');
const { JWTStrategy } = require("@sap/xssec").v3;
// const PDFController = require("./controllers/PDF.controller");

const app = express();
// xsenv.loadEnv();
let services;
if (process.env.VCAP_SERVICES) {
  services = xsenv.getServices({ uaa: 'ctc_srv-xsuaa' });
} else {
  const envData = JSON.parse(fs.readFileSync("./default-env.json", "utf8"));
  services = { uaa: envData.VCAP_SERVICES.xsuaa[0].ctc_srv_xsuaa };
}

app.use(express.json());
passport.use(new JWTStrategy(services.uaa));
app.use(passport.initialize());

app.use("/ctcletter", passport.authenticate('JWT', { session: false }), (req, res, next) => {
  passport.authenticate('JWT', { session: false }, (err, user, info) => {
    if (err || !user) {
      return res.status(401).json({
        error: "Unauthorized access",
        message: info?.message || "Invalid or missing token"
      });
    }
    if (!req.body.userid) {
      if (isNaN(user.id)) {
        return res.status(404).json({
          id: user.id,
          error: 'Invalid user ID format'
        });
      }
      req.user = user;
    }

    next();
  })(req, res, next);
}, PDFRoutes);

app.use("/", (req, res) => {
  try {
    res.status(200).json({ message: "Welcome to CTC Letter API service test deploy1 " });
  } catch (err) {
    res.status(500).json({ error: err.message }); 
  }
});

(async () => {
  const getPort = (await import('get-port')).default;

  const SF_axios = await BasicAuthAxios("SFSFDEST");     // dev
  // const SF_axios = await BasicAuthAxios("SF");        // qae
  Sf_Api.setAxios(SF_axios);

  const Adobe_axios = await OAuth2Axios("adobe_ads_rest_api"); //dev
  Adobe_Api.setAxios(Adobe_axios);

  const port = await getPort({ port: 8080 });
  app.listen(port, async () => {
    console.log(`Server running on port : http://localhost:${port}/`);
  });
})();





