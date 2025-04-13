
require("dotenv").config({ path: "default-env.json" });
const express = require("express");
const SapCfAxios = require("sap-cf-axios").default;
const axios = require("axios");
const qs = require("qs");
const fs = require("fs");

const app = express();
const PORT = 8080;
let SF_axios ;
let Adobe_axios ;

// 🔁 Async AxiosInstance helper
const AxiosInstance = async (destinationName) => {
    if (process.env.VCAP_SERVICES) {

        return SapCfAxios(destinationName);
    } else {
        const envData = JSON.parse(fs.readFileSync("./default-env.json", "utf8"));
        const destinations = envData.VCAP_SERVICES.destination;
        // const destinations = require("./default-env.json").VCAP_SERVICES.destination;
        const destination = destinations.find(dest => dest.name === destinationName);
        if (!destination) throw new Error(`Destination ${destinationName} not found`);

        const { url, authentication } = destination.credentials;

        if (authentication === "BasicAuthentication") {
            return axios.create({
                baseURL: url,
                auth: {
                    username: destination.credentials.username,
                    password: destination.credentials.password
                }
            });
        }

        if (authentication === "OAuth2ClientCredentials") {
            const tokenResponse = await axios.post(
                destination.credentials.tokenServiceURL,
                qs.stringify({
                    grant_type: "client_credentials",
                    client_id: destination.credentials.clientid,
                    client_secret: destination.credentials.clientsecret
                }),
                {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    }
                }
            );

            const accessToken = tokenResponse.data.access_token;
            
            return axios.create({
                baseURL: url,
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
        }

        throw new Error(`Unsupported authentication type: ${authentication}`);
    }
};

app.get("/prdcomponent", async (req, res) => {
    try {
        const response = await SF_axios.get("/odata/v2/FOPayComponent", {
            params: { $format: "json" },
            headers: { accept: "application/json" }
        });

        res.status(200).json(response.data.d.results);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get("/", async (req, res) => {
    try {
        const response = await SF_axios.get("/odata/v2/");
        res.status(200).json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get("/adsapi", async (req, res) => {
    try {
        const response = await Adobe_axios.get("/v1/forms?limit=0&offset=0&select=formData");
        res.status(200).json(response.data);

        console.log(response.data)
    } catch (error) {
        res.status(500).json({ error: error.message });
    }

});

app.listen(PORT, async() => {
    SF_axios =   await AxiosInstance("SFSFDEST");
    Adobe_axios =   await AxiosInstance("abobe_ads_rest_api");
    console.log(`🚀 Server running on port ${PORT}`);
});
