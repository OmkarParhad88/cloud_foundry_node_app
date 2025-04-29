const fs = require('fs');
const path = require('path');
const payCompSRNo = require('../assets/payCompSRNO.json');

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

function getCurrentFormattedDate() {
  const today = new Date();
  const day = today.getDate();
  const month = today.toLocaleString('en-US', { month: 'long' });
  const year = today.getFullYear();
  return `${day} ${month}, ${year}`;
}
function getPayCompById(EmpPayCompsRecurring, FOPayComponents) {

  var EmpPayComps = EmpPayCompsRecurring.filter(item => item.paycompvalue !== "0").map(item => ({
    payComponent: item.payComponent,
    payCompValue: item.paycompvalue,
  }));

  var FOPayComps = FOPayComponents.map((item) => ({
    name: item.name,
    externalCode: item.externalCode,
  }));

  const matched = payCompSRNo
    .map(id => EmpPayComps.find(item => item.payComponent === id))
    .filter(Boolean); // remove nulls if any ID not found

  // Step 3: Get unmatched items
  const unmatched = EmpPayComps.filter(
    item => !payCompSRNo.includes(item.payComponent)
  );

  // Step 4: Final ordered array
  const orderedEmpPayComps = [...matched, ...unmatched];

  // FOPayComps = FOPayComps.concat(newFoPayComps);


  const RecurringComps = orderedEmpPayComps.map((item) => {


    const FOPayComp = FOPayComps.find(
      (elm) => elm.externalCode === item.payComponent
    );
    return {
      PayComponent: FOPayComp ? `${FOPayComp.name} (${item.payComponent})` : 'Unknown Component',
      Amount: item.payCompValue,
    };
  });
  return  reversedPayCompSRNo = [...RecurringComps].reverse();
}


module.exports = { formatSAPDateCustom, imageToBase64, removeBrackets, bindSalutationAndName, getCompanyAddress, getCurrentFormattedDate, getPayCompById };  