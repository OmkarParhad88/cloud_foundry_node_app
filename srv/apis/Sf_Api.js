let axios;
const setAxios = (instance) => {
  axios = instance;
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
    if (err.response.status === 404) {
      return null;
    }
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

const getEmpPayCompRecurringResponse = async (userId) => {
  try {
    const url = `/odata/v2/EmpPayCompRecurring?$format=json&$filter=userId eq '${userId}'`;

    const EmpPayCompRecurring = await axios.get(url);

    return EmpPayCompRecurring.data.d.results;
  } catch (err) {
    throw new Error(err.message);
  }
};

module.exports = { setAxios, getFOPayComponentsResponse, getUserResponse, getEmpPayCompRecurringResponse };