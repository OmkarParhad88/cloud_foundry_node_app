const fs = require('fs');
const path = require('path');

function formatSAPDateCustom(sapDateStr) {
  const timestamp = parseInt(sapDateStr.replace(/\/Date\((\d+)\)\//, '$1'));
  const date = new Date(timestamp);

  const day = date.getDate();
  const month = date.toLocaleString('en-US', { month: 'long' });
  const year = date.getFullYear();

  return `${day} ${month}, ${year}`;
}

const imageToBase64 = (imagePath) => {
  const imgPath = path.join(__dirname, 'images', `${imagePath}.jpg`);
  const imageBase64 = fs.existsSync(imgPath)
    ? fs.readFileSync(imgPath, { encoding: 'base64' })
    : null;
  return imageBase64;
}



module.exports = { formatSAPDateCustom, imageToBase64 };