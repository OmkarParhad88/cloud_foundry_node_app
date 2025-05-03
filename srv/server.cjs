
require("dotenv").config({ path: "default-env.json" });
const express = require("express");
const { BasicAuthAxios, OAuth2Axios } = require("./config/destinations.config")
const  PDFRoutes = require("./routes/PDF.routes");
const  Sf_Api  = require("./apis/Sf_Api");
const Adobe_Api = require("./apis/Adobe_Api");
const fs = require("fs");
const passport = require('passport');
const xsenv = require('@sap/xsenv');
const { JWTStrategy } = require("@sap/xssec").v3;

const app = express();
const PORT = 8080;

let services;
if (process.env.VCAP_SERVICES) {
   services = xsenv.getServices({ uaa: 'ctc_srv-xsuaa' });
} else {
    const envData = JSON.parse(fs.readFileSync("./default-env.json", "utf8"));
 services =  { uaa: envData.VCAP_SERVICES.xsuaa[0].credentials };
}

passport.use(new JWTStrategy(services.uaa));

app.use(express.json());
app.use(passport.initialize());

app.use("/ctcletter",passport.authenticate("JWT", { session: false }), PDFRoutes);
app.use("/", (req, res) => {
    try {
      res.status(200).json({ message: "Welcome to CTC Letter API" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });


app.use((err, req, res, next) => {
    if (err.name === "UnauthorizedError") {
      return res.status(401).json({ error: "Unauthorized - Invalid or missing token" });
    }
    next(err);
  });


app.listen(PORT, async () => {

    // local testing

    // const SF_axios = await BasicAuthAxios("SFSFDEST");     // dev
    const SF_axios = await BasicAuthAxios("SF");        // qae
    // const SF_axios = await BasicAuthAxios("SF_PRD");  // prd
    Sf_Api.setAxios(SF_axios);

    // const Adobe_axios = await OAuth2Axios("abobe_ads_rest_api"); //dev
    // Adobe_Api.setAxios(Adobe_axios);


    //  production

    // // const SF_axios = await BasicAuthAxios("SFSFDEST");     // dev
    // const SF_axios = await BasicAuthAxios("SF");        // qae
    // Sf_Api.setAxios(SF_axios);

    // const Adobe_axios = await OAuth2Axios("abobe_ads_rest_api"); //dev
    // Adobe_Api.setAxios(Adobe_axios);

    console.log(`Server running on port : http://localhost:${PORT}/`);
});




