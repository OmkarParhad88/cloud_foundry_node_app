
require("dotenv").config({ path: "default-env.json" });
const express = require("express");
const { BasicAuthAxios, OAuth2Axios } = require("./config/destinations.config")
const  SFRoutes = require("./routes/SF.routes");
const AdobeRoutes  = require("./routes/Adobe.routes");
const  Sf_Api  = require("./externalApi/Sf_Api");
const  Adobe_Api = require("./externalApi/Adobe_Api");

const app = express();
const PORT = 8080;

app.use(express.json());
app.use("/", SFRoutes);
app.use("/", AdobeRoutes);

app.listen(PORT, async () => {
    // const SF_axios = await BasicAuthAxios("SFSFDEST");     // dev
    // const SF_axios = await BasicAuthAxios("SF");        // qae
    const SF_axios = await BasicAuthAxios("SF_PRD");  // prd
    Sf_Api.setAxios(SF_axios);

    // const Adobe_axios = await OAuth2Axios("abobe_ads_rest_api"); //dev
    // Adobe_Api.setAxios(Adobe_axios);

    console.log(`Server running on port : http://localhost:${PORT}/`);
});




