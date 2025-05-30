const Adobe_Api = require("../apis/Adobe_Api");
const utils = require("../utils/utils");

//base url of ctc letter service
const getBase = async (req, res) => {
  let response = {
    "success": " Welcome in CTC letter base route",
    "user": req.user
  }

  try {
    res.status(200).json(response);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

// ctc letter xml response route
const getCtcLetterXML = async (req, res) => {
  try {

    let userId

    if (req.user.id) {
      userId = req.user.id;
    }
    if (req.body.userid) {
      userId = req.body.userid;
    }

    if (!userId) {
      return res.status(404).json({ error: 'User not found' });
    }

    const response = await utils.getCtcLetterJsonData(userId);
    const ctc_xml = await utils.getCTC_letter_XML(response);

    res.setHeader("Content-Type", "text/xml");
    res.status(200).send(ctc_xml);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

//
const getCtcLetterJson = async (req, res) => {
  try {
    let userId

    if (req.user.id) {
      userId = req.user.id;
    }
    if (req.body.userid) {
      userId = req.body.userid;
    }

    if (!userId) {
      return res.status(404).json({ error: 'User not found' });
    }

    const response = await utils.getCtcLetterJsonData(userId);
    res.status(200).json(response);
  } catch (err) {
    res.status(500).json({
      error: true,
      message: "Internal Server Error",
      details: err
    })
  }
};

// ctc letter pdf response route
const getCTCLetterPDF = async (req, res) => {
  try {

    let userId

    if (req.user.id) {
      userId = req.user.id;
    }
    if (req.body.userid) {
      userId = req.body.userid;
    }

    if (!userId) {
      return res.status(404).json({ error: 'User not found' });
    }

    const response = await utils.getCtcLetterJsonData(userId);
    if (!response) {
      return res.status(404).json({ error: 'User not found' });
    }
    const ctc_xml = await utils.getCTC_letter_XML(response);
    const xmlBase64 = Buffer.from(ctc_xml).toString("base64");

    const payload = {
      embedFont: 0,
      formLocale: "en_US",
      formType: "print",
      taggedPdf: 1,
      xdpTemplate: "ctc_letter/ctc_letter_tmp",
      xmlData: xmlBase64,
    };

    const fileBuffer = await Adobe_Api.getCTCLetterResponse(payload);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `inline; filename="CTC letter ${userId}.pdf"`);
    res.send(fileBuffer);
  } catch (err) {
    res.status(500).json({
      error: true,
      message: "Internal Server Error",
      details: err
    })
  }
};

module.exports = {
  getBase,
  getCTCLetterPDF,
  getCtcLetterJson,
  getCtcLetterXML
};
