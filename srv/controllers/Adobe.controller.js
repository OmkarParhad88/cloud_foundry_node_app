let axios;

const setAxios = (instance) => {
    axios = instance;
};

const getForms = async (req, res) => {
    try {
        const response = await axios.get("/v1/forms?limit=0&offset=0&select=formData");
        res.status(200).json(response.data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { setAxios, getForms };
