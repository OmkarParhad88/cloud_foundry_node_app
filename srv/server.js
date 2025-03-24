require("dotenv").config({ path: "default-env.json" });
const express = require("express");
const SapCfAxios = require("sap-cf-axios").default;
const axios = require("axios");
var xml = require('xml');



const app = express();
const PORT = 8080;

const AxiosInstance = (destinationName) => {
    if (process.env.VCAP_SERVICES) {
        return SapCfAxios(destinationName);
    } else {
        const destinations = require("./default-env.json").VCAP_SERVICES.destination;
        const destination = destinations.find(dest => dest.name === destinationName);
        if (!destination) throw new Error(`Destination ${destinationName} not found`);

        return axios.create({
            baseURL: destination.credentials.url,
            auth: {
                username: destination.credentials.username,
                password: destination.credentials.password
            }
        });
    }
};


// const axios2 = SapCfAxios("SFSF");
const axios1 = AxiosInstance("SFSFDEST");

app.get("/prdcomponent", async (req, res) => {
    try {
        const response = await axios1({
            method: "GET",
            url: "/odata/v2/FOPayComponent",
            params: { $format: "json" },
            headers: { accept: "application/json" }
        });

        
        res.status(200).json(response.data.d.results);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get("/metadata", async (req, res) => {
    try {
        const response = await axios1({
            method: "GET",
            url: "/odata/v2/$metadata",
            responseType: "text",
        });
        res.setHeader("Content-Type", "application/xml"); 
        res.status(200).send(response.data);
        // response.pipe(res); // Stream the response directly
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error.message });
    }
});

app.get("/", async (req, res) => {
    try {
        const response = await axios1({
            method: "GET",
            url: "/odata/v2/"
        });
        res.status(200).json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// const axios2 = SapCfAxios("SF");
// const qasComponent = async (req, res) => {
//     try {
//         const response = await axios2({
//             method: "GET",
//             url: "/odata/v2/FOPayComponent",
//             params: { $format: "json" },
//             headers: { accept: "application/json" }
//         });
//         res.json(response.data.d.results);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

// app.get("/qascomponent", qasComponent);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
