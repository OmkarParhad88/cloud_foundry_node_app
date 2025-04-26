
const getForms = async (req, res) => {
    try {
        const response = await axios.get(
            "/v1/forms?limit=0&offset=0&select=formData"
        );
        res.status(200).json(response.data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getFormsTemplate = async (req, res) => {
    try {
        const response = await axios.get(
            "/v1/forms?limit=0&offset=0&select=formData"
        );
        res.status(200).json(response.data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getCTCLetter = async (req, res) => {
    try {
        const xmlData = `<?xml version="1.0" encoding="UTF-8"?>
                    <form1>
                        <LabelForm>
                            <DeliveryId>3433</DeliveryId>
                            <Position>omkar</Position>
                            <MaterialNo>parhad</MaterialNo>
                            <Quantity>sap consultant </Quantity>
                            <Package>java script</Package>
                        </LabelForm>
                    </form1>`;

        const xmlBase64 = Buffer.from(xmlData).toString("base64");

        const payload = {
            embedFont: 0,
            formLocale: "en_US",
            formType: "print",
            taggedPdf: 1,
            xdpTemplate: "ctc_letter/trial",
            xmlData: xmlBase64,
        };

        const response = await axios.post(
            "/v1/adsRender/pdf?templateSource=storageName&TraceLevel=0",
            payload,
            { headers: { "Content-Type": "application/json" } }
        );

        const fileBuffer = Buffer.from(response.data.fileContent, "base64");

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", "inline; ctc_letter.pdf");
        res.send(fileBuffer);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error generating PDF");
    }
};

module.exports = {  getForms, getFormsTemplate, getCTCLetter };
