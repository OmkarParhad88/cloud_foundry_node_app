let axios;
const setAxios = (instance) => {
  axios = instance;
};

const getCTCLetterResponse = async (payload) => {
  try {
    const response = await axios.post(
      "/v1/adsRender/pdf?templateSource=storageName&TraceLevel=0",
      payload,
      { headers: { "Content-Type": "application/json" } }
    );
    const fileBuffer = Buffer.from(response.data.fileContent, "base64");
    return fileBuffer;
  } catch (err) {
    throw new Error(err);
  }
};

module.exports = { setAxios, getCTCLetterResponse };