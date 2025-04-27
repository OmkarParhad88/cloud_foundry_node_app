const Sf_Api = require("../apis/Sf_Api");
const Adobe_Api = require("../apis/Adobe_Api");
const { formatSAPDateCustom, imageToBase64, removeBrackets, bindSalutationAndName, getCompanyAddress, getCurrentFormattedDate } = require("../utils/utils");

const headers_footers = require("../assets/ctc_headers_footers.json");

//adobe controllers

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
    const Forms = await Adobe_Api.getFormsResponse();
    res.status(200).json(Forms);
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
    const userId = req.query.userid?.trim();

    const User = await Sf_Api.getUserResponse(userId);
    const EmpPayCompsRecurring = await Sf_Api.getEmpPayCompRecurringResponse(userId);
    const FOPayComponents = await Sf_Api.getFOPayComponentsResponse();

    var EmpPayComps = EmpPayCompsRecurring.filter(item => item.paycompvalue !== "0").map(item => ({
        payComponent: item.payComponent,
        payCompValue: item.paycompvalue,
      }));

    var FOPayComps = FOPayComponents.map((item) => ({
      name: item.name,
      externalCode: item.externalCode,
    }));

    const company = removeBrackets(User?.custom04);
    const address = getCompanyAddress(headers_footers, company);
    const fileName = headers_footers.find((item) => item.company_name === company)?.file_name || '';
    const formattedDate = formatSAPDateCustom(User?.hireDate);
    const image = await imageToBase64(fileName);
    const name = bindSalutationAndName(User?.salutation, User?.displayName);
    const RecurringComps = EmpPayComps.map((item) => {
      const FOPayComp = FOPayComps.find(
        (elm) => elm.externalCode === item.payComponent
      );
      return {
        PayComponent: FOPayComp ? `${FOPayComp.name} (${item.payComponent})` : 'Unknown Component',
        Amount: item.payCompValue,
      };
    });
    const currentData = await getCurrentFormattedDate();
    //EmpPayCompNonRecurring

    let response = {
      userId: User?.userId || "",
      currentData : currentData,
      name: name,
      designation: User?.title || "",
      company: company,
      fileName: fileName,
      headerImage: "",
      date: formattedDate,
      hrSignature: "",
      address: address,
      payComponent: RecurringComps || []
    };

    res.status(200).json(response);
  } catch (err) {
    res.status(500).json({ error: err.message });
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
