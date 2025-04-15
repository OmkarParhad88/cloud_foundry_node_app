
require("dotenv").config({ path: "default-env.json" });
const express = require("express");
const { BasicAuthAxios, OAuth2Axios } = require("./config/destinations.config")
const { router: SFRoutes, setAxios: setSF } = require("./routes/SF.routes");
const { router: AdobeRoutes, setAxios: setAdobe } = require("./routes/Adobe.routes");

const app = express();
const PORT = 8080;

app.use(express.json());
app.use("/", SFRoutes);
app.use("/", AdobeRoutes);

app.listen(PORT, async () => {
    const SF_axios = await BasicAuthAxios("SFSFDEST");
    const Adobe_axios = await OAuth2Axios("abobe_ads_rest_api");
    setSF(SF_axios);
    setAdobe(Adobe_axios);
    console.log(`Server running on port : ${PORT}`);
});




