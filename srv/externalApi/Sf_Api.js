let axios;
const setAxios = (instance) => {
  axios = instance;
};

const getBaseResponse = async () => {
  try {
    const response = await axios.get("/odata/v2/");
    return response.data;
  } catch (err) {
    throw new Error(err.message);
  }
};

const getUserResponse = async (userid) => {
  try {
    const UserData = await axios.get(`/odata/v2/User(${userid})`, {
      params: {
        $format: "json",
      }
    });
    return UserData.data.d;
  } catch (err) {
    throw new Error(err.message);
  }
};

const getFOPayComponentsResponse = async () => {
  try {
    const response = await axios.get("/odata/v2/FOPayComponent", {
      params: { $format: "json" }
    });

    return response.data.d.results;
  } catch (err) {
    throw new Error(err.message);
  }
};

const getCompaniesResponse = async () => {
  try {
    const response = await axios.get("/odata/v2/FOCompany", {
      params: { $format: "json" }
    });
    return response.data.d.results;
  } catch (err) {
    throw new Error(err.message);
  }
};

const getEmpPayCompRecurringResponse = async (userId) => {
  try {
    const url = `/odata/v2/EmpPayCompRecurring?$format=json&$filter=userId eq '${userId}'`;

    const EmpPayCompRecurring = await axios.get(url);

    return EmpPayCompRecurring.data.d.results;
  } catch (err) {
    throw new Error(err.message);
  }
};

const getEmpPayCompNonRecurringResponse = async (userId) => {
  try {
    const url = `/odata/v2/EmpPayCompNonRecurring?$format=json&$filter=userId eq '${userId}'`;

    const EmpPayCompNonRecurring = await axios.get(url);
    return EmpPayCompNonRecurring.data.d.results;
  } catch (err) {
    throw new Error(err.message);
  }
};

module.exports = { setAxios, getBaseResponse, getFOPayComponentsResponse, getUserResponse, getCompaniesResponse, getEmpPayCompRecurringResponse, getEmpPayCompNonRecurringResponse };