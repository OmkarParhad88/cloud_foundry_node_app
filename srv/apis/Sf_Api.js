let axios;
const setAxios = (instance) => {
  axios = instance;
};

//get the  user data form sf
const getUserResponse = async (userid) => {
  try {
    const UserData = await axios.get(`/odata/v2/User(${userid})`, {
      params: {
        $format: "json",
      },
    });
    return UserData.data.d;
  } catch (err) {
    if (err.response.status === 404) {
      return null;
    }
    throw err;
  }
};

//get the  user email to user id form sf
const getEmailToUserId = async (userEmail) => {
  try {
    const UserData = await axios.get(
      `/odata/v2/cust_Email2UserId?$filter= externalCode eq '${userEmail}'`,
      {
        params: {
          $format: "json",
        },
      }
    );
    return UserData.data.d.results;
  } catch (err) {
    if (err.response.status === 404) {
      return null;
    }
    throw err;
  }
};

//get the pay components data form sf
const getFOPayComponentsResponse = async () => {
  try {
    const response = await axios.get("/odata/v2/FOPayComponent", {
      params: { $format: "json" },
    });

    return response.data.d.results;
  } catch (err) {
    throw err;
  }
};

//get the  user paycomponent data form sf
const getEmpPayCompRecurringResponse = async (userId) => {
  try {
    const url = `/odata/v2/EmpPayCompRecurring?$format=json&$filter=userId eq '${userId}'`;

    const EmpPayCompRecurring = await axios.get(url);

    return EmpPayCompRecurring.data.d.results;
  } catch (err) {
    throw err;
  }
};

module.exports = {
  setAxios,
  getFOPayComponentsResponse,
  getUserResponse,
  getEmpPayCompRecurringResponse,
  getEmailToUserId,
};
