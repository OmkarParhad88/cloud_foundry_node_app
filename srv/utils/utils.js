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

const imageToBase64 = async (fileName) => {
  if (!fileName) {
    return "";
  } // Should print the current script's directory

  const imgFullPath = path.resolve(__dirname, '../assets/images/headers_images', `${fileName}.png`);

  if (!fs.existsSync(imgFullPath)) {
    return "";
  }

  try {
    const imageBase64 = fs.readFileSync(imgFullPath, { encoding: 'base64' });
    return imageBase64;
  } catch (err) {
    console.error("Error reading image:", err);
    return "";
  }
};

function removeBrackets(text) {
  if (!text) {
    return '';
  }

  return text.replace(/\s*\(.*?\)\s*/g, '').trim();
}

function bindSalutationAndName(salutation, name) {
  if (!name) return '';

  if (!salutation) return name;

  const formattedSalutation = salutation
    ? salutation.charAt(0).toUpperCase() + salutation.slice(1).toLowerCase()
    : '';

  return `${formattedSalutation}. ${name}`;
}

function getCompanyAddress(companies, companyName) {
  if (!companyName) {
    return '';
  }

  const company = companies.find(item => item.company_name === companyName);

  if (!company && company.footer_text.trim() === '') {
    return '';
  }

  return company.footer_text;
}

module.exports = { formatSAPDateCustom, imageToBase64, removeBrackets, bindSalutationAndName, getCompanyAddress };  