let axios;

const setAxios = (instance) => {
    axios = instance;
};

const getFOPayComponents = async (req, res) => {
    try {
        const response = await axios.get("/odata/v2/FOPayComponent", {
            params: { $format: "json" },
            headers: { accept: "application/json" }
        });

        var comps = response.data.d.results.map(item => item.name);
        res.status(200).json(comps);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getBase = async (req, res) => {
    try {
        const response = await axios.get("/odata/v2/");
        res.status(200).json(response.data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { setAxios, getFOPayComponents, getBase };
