const e = require("express");

let axios;

const setAxios = (instance) => {
  axios = instance;
};

const getFOPayComponents = async (req, res) => {
  try {
    const response = await axios.get("/odata/v2/FOPayComponent", {
      params: { $format: "json" },
      headers: { accept: "application/json" },
    });

    var comps = response.data.d.results.map((item) => ({
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
    const UserData = await axios.get("/odata/v2/User", {
      params: {
        $format: "json",
        $filter: `userId eq '${req.query.userid}'`,
      },
      headers: { accept: "application/json" },
    });
    res.status(200).json(UserData.data);
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
const getCompanies = async (req, res) => {
  try {
    const response = await axios.get("/odata/v2/FOCompany", {
      params: { $format: "json" },
      headers: { accept: "application/json" },
    });

    var comps = response.data.d.results.map((item) =>( {
     name: item.name,
      externalCode:  item.externalCode,
    }));
    res.status(200).json(comps);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const getEmpPayComponents = async (req, res) => {
  try {
    const UserData = await axios.get("/odata/v2/User", {
      params: {
        $format: "json",
        $filter: `userId eq '${req.query.userid}'`,
      },
      headers: { accept: "application/json" },
    });

    const EmpPayCompRecurring = await axios.get("/odata/v2/EmpPayCompRecurring", {
      params: {
        $format: "json",
        $filter: `userId eq '${req.query.userid}'`,
      },
      headers: { accept: "application/json" },
    });

    const FOPayComponent = await axios.get("/odata/v2/FOPayComponent", {
      params: { $format: "json" },
      headers: { accept: "application/json" },
    });

    var EmpPayComps = EmpPayCompRecurring.data.d.results.map((item) => ({
      payComponent: item.payComponent,
      paycompvalue: item.paycompvalue,
    }));

    var FOPaycomps = FOPayComponent.data.d.results.map((item) => ({
      name: item.name,
      externalCode: item.externalCode,
    }));

    var comps = EmpPayComps.map((item) => {
      const FOPaycomp = FOPaycomps.find(
        (elm) => elm.externalCode === item.payComponent
      );
      return {
        PayComponent: FOPaycomp ? `${FOPaycomp.name} (${item.payComponent})` : 'Unknown Component',
        Amount: item.paycompvalue,
      };
    });


    const imgPath = path.join(__dirname, 'images', `${userId}.jpg`);
    const imageBase64 = fs.existsSync(imgPath)
      ? fs.readFileSync(imgPath, { encoding: 'base64' })
      : null;
    
    // console.log(comps)
   
    const customFormatted = formatSAPDateCustom(UserData.data.d.results[0].hireDate);

    let response = {
      userId: UserData.data.d.results[0].userId,
      name: UserData.data.d.results[0].displayName,
      salutation: UserData.data.d.results[0].salutation,
      designation: UserData.data.d.results[0].title,
      custom04 : UserData.data.d.results[0].custom04,
      image: imageBase64,
      date: customFormatted,
      company1: UserData.data.d.results[0].custom05,
      company2: UserData.data.d.results[0].location,
      hrSignature: "",
      address: "",
      payComponent : comps

    }
    res.status(200).json(comps);
    // res.status(200).json(response.data.d.results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  setAxios,
  getFOPayComponents,
  getBase,
  getCompanies,
  getEmpPayComponents,
  getUser,
  
};
