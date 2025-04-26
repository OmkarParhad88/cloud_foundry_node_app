const Sf_Api = require("../externalApi/Sf_Api");
const { formatSAPDateCustom, imageToBase64 } = require("../utils/utils");

const getFOPayComponents = async (req, res) => {
  try {
    const components = await Sf_Api.getFOPayComponentsResponse();
    
    var comps =components.map((item) => ({
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

    var EmpPayComps = EmpPayCompsRecurring.map((item) => ({
      payComponent: item.payComponent,
      paycompvalue: item.paycompvalue,
    }));

    var FOPaycomps = FOPayComponents.map((item) => ({
      name: item.name,
      externalCode: item.externalCode,
    }));

    //EmpPayCompNonRecurring

    var comps = EmpPayComps.map((item) => {
      const FOPaycomp = FOPaycomps.find(
        (elm) => elm.externalCode === item.payComponent
      );
      return {
        PayComponent: FOPaycomp ? `${FOPaycomp.name} (${item.payComponent})` : 'Unknown Component',
        Amount: item.paycompvalue,
      };
    });
    const customFormatted = formatSAPDateCustom(User.hireDate || "");

    let response = {
      userId: User?.userId || "",
      name: User?.displayName || "",
      salutation: User?.salutation || "",
      designation: User?.title || "",
      custom04: User?.custom04 || "",
      image: "",
      date: customFormatted || "",
      company1: User?.custom05 || "",
      company2: User?.location || "",
      hrSignature: "",
      address: "",
      payComponent: comps || []
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
};
