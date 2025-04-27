
require("dotenv").config({ path: "default-env.json" });
const express = require("express");
const { BasicAuthAxios, OAuth2Axios } = require("./config/destinations.config")
const  PDFRoutes = require("./routes/PDF.routes");
const  Sf_Api  = require("./apis/Sf_Api");
const  Adobe_Api = require("./apis/Adobe_Api");

const app = express();
const PORT = 8080;

app.use(express.json());
app.use("/", PDFRoutes);

app.listen(PORT, async () => {
    // const SF_axios = await BasicAuthAxios("SFSFDEST");     // dev
    // const SF_axios = await BasicAuthAxios("SF");        // qae
    const SF_axios = await BasicAuthAxios("SF_PRD");  // prd
    Sf_Api.setAxios(SF_axios);

    // const Adobe_axios = await OAuth2Axios("abobe_ads_rest_api"); //dev
    // Adobe_Api.setAxios(Adobe_axios);

    console.log(`Server running on port : http://localhost:${PORT}/`);
});




