const Sf_Api = require("../apis/Sf_Api");
const Adobe_Api = require("../apis/Adobe_Api");
const utils = require("../utils/utils");

const headers_footers = require("../assets/ctc_headers_footers.json");

//adobe controllers

const getCTCLetter = async (req, res) => {
  try {
    const xmlData = `<?xml version="1.0" encoding="UTF-8"?>
                        <data>
                          <SFPSY>
                              <DATE/>
                              <TIME/>
                              <USERNAME/>
                              <SUBRC/>
                          </SFPSY>
                          <GV_DATE/>
                          <GV_TEXT1/>
                          <GV_TEXT2/>
                          <GV_TEXT3/>
                          <GV_TEXT4/>
                          <EMP_CODE>Mirum est</EMP_CODE>
                          <GV_COMPANY>Si manu vacuas</GV_COMPANY>
                          <GV_NAME/>
                          <GV_DESIG/>
                          <SYSTEMDATE/>
                          <EMP_NAME>Ego ille</EMP_NAME>
                          <JOIN_DATE>Si manu vacuas</JOIN_DATE>
                          <EMP_DESIG>Apros tres et quidem</EMP_DESIG>
                          <COMPANY_NAME/>
                          <SIGN_NAME>Apros tres et quidem</SIGN_NAME>
                          <ADDRESS1>Ad retia sedebam</ADDRESS1>
                          <ADDRESS2>Mirum est</ADDRESS2>
                          <ADDRESS3>Vale</ADDRESS3>
                          <ADDRESS4>Ego ille</ADDRESS4>
                          <PHONE_TEXT>Licebit auctore</PHONE_TEXT>
                          <FAX_TEXT>Si manu vacuas</FAX_TEXT>
                          <EMAIL_TEXT>Proinde</EMAIL_TEXT>
                          <WEB_TEXT>Apros tres et quidem</WEB_TEXT>
                          <CIN_TEXT>Am undique</CIN_TEXT>
                          <SIGN_LOGO/>
                          <GRAPHIC/>
                          <COMP_LOGO/>
                          <GRAPHIC1/>
                          <PAY_COMP>
                              <DATA>
                                <LGTXT>Licebit auctore</LGTXT>
                                <BETRG>Proinde</BETRG>
                              </DATA>
                              <DATA>
                                <LGTXT>Am undique</LGTXT>
                                <BETRG>Ad retia sedebam</BETRG>
                              </DATA>
                              <DATA>
                                <LGTXT>Vale</LGTXT>
                                <BETRG>Ego ille</BETRG>
                              </DATA>
                          </PAY_COMP>
                        </data>`;
    const ctc_xml = await utils.getCTC_letter_XML();
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
    res.setHeader("Content-Disposition", "inline; ctc_letter.pdf");

    res.send(fileBuffer);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

const getForms = async (req, res) => {
  try {
    const Form = await Adobe_Api.getFormsResponse();
    res.status(200).json(Form);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// sf apis

const getFOPayComponents = async (req, res) => {
  try {
    const components = await Sf_Api.getFOPayComponentsResponse();

    var comps = components.map((item) => ({
      name: item.name,
      externalCode: item.externalCode,
    }));

    res.status(200).json(comps);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const getUser = async (req, res) => {
  try {
    const UserData = await Sf_Api.getUserResponse(req.query.userid);
    res.status(200).json(UserData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const getBase = async (req, res) => {
  try {
    const response = await Sf_Api.getBaseResponse();
    res.status(200).json(response);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};
const getCompanies = async (req, res) => {
  try {
    const companies = await Sf_Api.getCompaniesResponse();
    var comps = companies.map((item) => ({
      name: item.name,
      externalCode: item.externalCode,
    }));
    res.status(200).json(comps);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const getEmpPayComponents = async (req, res) => {
  try {
    const userId = req.body.userid

    const User = await Sf_Api.getUserResponse(userId);
    const EmpPayCompsRecurring = await Sf_Api.getEmpPayCompRecurringResponse(userId);
    const FOPayComponents = await Sf_Api.getFOPayComponentsResponse();

    const RecurringComps = utils.getPayCompByCompId(EmpPayCompsRecurring, FOPayComponents);

    const company = utils.geEmpCompanyName(User?.custom04);
    const address = utils.getCompanyAddress(headers_footers, company);
    const fileName = headers_footers.find((item) => item.company_name === company)?.file_name || '';
    const formattedDate = utils.formatSAPDateCustom(User?.hireDate);
    const CompanyLogo = await utils.imageToBase64PNG(fileName ,"headers_images");
    const signature = await utils.imageToBase64PNG("signature" ,"signature_images");
    const name = utils.bindSalutationAndName(User?.salutation, User?.displayName);

    let response = {
      userId: User?.userId || "",
      name: name,
      designation: User?.title || "",
      company: company,
      fileName: fileName,
      headerImage: CompanyLogo,
      joiningDate: formattedDate,
      signature: signature,
      address: address,
      payComponent: RecurringComps || []
    };
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
    res.setHeader("Content-Disposition", "inline; ctc_letter.pdf");
    res.send(fileBuffer);
  } catch (err) {
    res.status(500).json({
      error: true,
      message: "Internal Server Error",
      details: err.message || err.toString()
    })
  }
};

module.exports = {
  getFOPayComponents,
  getBase,
  getCompanies,
  getEmpPayComponents,
  getUser,
  getForms,
  getCTCLetter
};
