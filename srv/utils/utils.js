const fs = require('fs');
const path = require('path');
const xml2js = require('xml2js');
const payCompSRNo = require('../assets/payCompSRNO.json');
const e = require('express');
const ctc_xml = fs.readFileSync(path.resolve(__dirname, '../assets/Salary_certificate.xml'), 'utf-8');

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

const imageToBase64PNG = async (fileName,folder) => {
  if (!fileName) {
    return "";
  } 

  const imgFullPath = path.resolve(__dirname, `../assets/images/${folder}`, `${fileName}.png`);

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

function geEmpCompanyName(text) {
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
function getPayCompByCompId(EmpPayCompsRecurring, FOPayComponents) {

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
    .filter(Boolean);

  const unmatched = EmpPayComps.filter(
    item => !payCompSRNo.includes(item.payComponent)
  );

  const orderedEmpPayComps = [...matched, ...unmatched];

  const RecurringComps = orderedEmpPayComps.map((item) => {


    const FOPayComp = FOPayComps.find(
      (elm) => elm.externalCode === item.payComponent
    );
    return {
      PayComponent: FOPayComp ? `${FOPayComp.name} (${item.payComponent})` : 'Unknown Component',
      Amount: item.payCompValue,
    };
  });
  return reversedPayCompSRNo = [...RecurringComps];
}

function mapPayComp(data) {
  return data.map(item => ({
    LGTXT: [item.PayComponent],
    BETRG: [item.Amount]
  }));
}


async function  getCTC_letter_XML  (empData) {
  const parser = new xml2js.Parser({ explicitArray: true });
  const builder = new xml2js.Builder();
  let updatedXML;

  parser.parseString(ctc_xml, (err, result) => {
    if (err) throw err;

    result.data.EMP_CODE[0] = empData.userId;
    result.data.EMP_NAME[0] = empData.name;
    result.data.EMP_DESIG[0] = empData.designation;
    result.data.JOIN_DATE[0] = empData.joiningDate;
    result.data.SYSTEMDATE[0] = getCurrentFormattedDate();
    result.data.COMPANY_NAME[0] = empData.company;
    result.data.ADDRESS1[0] = empData.address;
    result.data.COMP_LOGO[0] = empData.headerImage;
    result.data.SIGN_NAME[0] = "Ramu Gajula";
    result.data.SIGN_LOGO[0] = empData.signature;
    result.data.PAY_COMP[0].DATA = mapPayComp(empData.payComponent);
     updatedXML =  builder.buildObject(result);
  });
  return updatedXML;
}

module.exports = { formatSAPDateCustom, imageToBase64PNG, geEmpCompanyName, bindSalutationAndName, getCompanyAddress, getCurrentFormattedDate, getPayCompByCompId, getCTC_letter_XML };  