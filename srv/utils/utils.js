const fs = require('fs');
const path = require('path');

function formatSAPDateCustom(sapDateStr) {
  if (!sapDateStr) {
    return ""; 
  }

  const match = sapDateStr.match(/\/Date\((\d+)\)\//);
  if (!match) {
    return "";
  }

  const timestamp = parseInt(match[1]);
  if (isNaN(timestamp)) {
    return ""; 
  }

  const date = new Date(timestamp);

  const day = date.getDate();
  const month = date.toLocaleString('en-US', { month: 'long' });
  const year = date.getFullYear();

  return `${day} ${month}, ${year}`;
}


const imageToBase64 = (imagePath) => {
  if (!imagePath) {
    return ""; // return empty string if input is null, undefined or empty
  }

  const imgFullPath = path.join(__dirname, 'images', `${imagePath}.jpg`);

  if (!fs.existsSync(imgFullPath)) {
    return ""; // if file does not exist, return empty string
  }

  try {
    const imageBase64 = fs.readFileSync(imgFullPath, { encoding: 'base64' });
    return imageBase64;
  } catch (err) {
    console.error("Error reading image:", err);
    return ""; // in case reading file fails
  }
};



module.exports = { formatSAPDateCustom, imageToBase64 };