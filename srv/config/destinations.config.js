const SapCfAxios = require("sap-cf-axios").default;
const axios = require("axios");
const qs = require("qs");
const fs = require("fs");

const BasicAuthAxios = async (destinationName) => {
    if (process.env.VCAP_SERVICES) {
        return SapCfAxios(destinationName);
    } else {
        try {
            const envData = JSON.parse(fs.readFileSync("./default-env.json", "utf8"));
            const destinations = envData.VCAP_SERVICES.destination;
            const destination = destinations.find(dest => dest.name === destinationName);
            if (!destination) throw new Error(`Destination ${destinationName} not found`);

            const { url, username, password } = destination.credentials;

            return axios.create({
                baseURL: url,
                auth: { username, password }
            });

        } catch (error) {
            throw err;
        }
    }
};

const OAuth2Axios = async (destinationName) => {
    if (process.env.VCAP_SERVICES) {
        return SapCfAxios(destinationName);
    } else {
        try {
            const envData = JSON.parse(fs.readFileSync("./default-env.json", "utf8"));
            const destinations = envData.VCAP_SERVICES.destination;
            const destination = destinations.find(dest => dest.name === destinationName);
            if (!destination) throw new Error(`Destination ${destinationName} not found`);

            const { url, tokenServiceURL, clientid, clientsecret } = destination.credentials;

            const tokenResponse = await axios.post(tokenServiceURL,
                qs.stringify({
                    grant_type: "client_credentials",
                    client_id: clientid,
                    client_secret: clientsecret
                }), {
                headers: { "Content-Type": "application/x-www-form-urlencoded" }
            });

            const accessToken = tokenResponse.data.access_token;
            return axios.create({
                baseURL: url,
                headers: { Authorization: `Bearer ${accessToken}` }
            });

        } catch (error) {
            throw err;
        }

    }
};

module.exports = { BasicAuthAxios, OAuth2Axios };
