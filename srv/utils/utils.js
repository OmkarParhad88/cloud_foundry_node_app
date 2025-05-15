const fs = require('fs');
const path = require('path');
const xml2js = require('xml2js');
const Sf_Api = require("../apis/Sf_Api");
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

function getCurrentFormattedDate() {
  const now = new Date();

  const formatter = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Kolkata',
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  return formatter.format(now);
}

function getFormattedTimestamp() {
  const now = new Date().toLocaleString("en-GB", {
    timeZone: "Asia/Kolkata",
    hour12: false
  });

  return `Generated on ${now}`;
}

const imageToBase64PNG = async (fileName, folder) => {
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
    throw err;
  }
};

function geEmpCompanyName(text) { 
  if (!text) {
    return '';
  }
 var test = text.replace(/\s+/g, ' ').replace(/\s*\([^)]*\)/, '').replace(/\./g, '').trim();

  return test;
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

  if (!company || !company.footer_text || company.footer_text.trim() === '') {
    return '';
  }
  return company.footer_text;
}

function getPayCompByCompId(EmpPayCompsRecurring, FOPayComponents) {
  const payCompSRNo = require('../assets/payCompSRNO.json');

  var EmpPayComps = EmpPayCompsRecurring.filter(item => item.paycompvalue !== "0").map(item => ({
    externalCode: item.payComponent,
    amount: Number(item.paycompvalue).toLocaleString('en-IN'),
  }));

  var FOPayComps = FOPayComponents.map((item) => ({
    compName: item.name,
    externalCode: item.externalCode,
  }));

  const matched = payCompSRNo.map(comp => EmpPayComps.find(item => item.externalCode === comp.externalCode)).filter(Boolean);

  const matchedComponents = payCompSRNo.map(item => item.externalCode);

  const unmatched = EmpPayComps.filter(
    item => !matchedComponents.includes(item.externalCode)
  );

  const orderedEmpPayComps = [...matched, ...unmatched];

  const RecurringComps = orderedEmpPayComps.map((item) => {
    const FOPayComp = FOPayComps.find(
      (elm) => elm.externalCode === item.externalCode
    );
    return {
      PayComponent: FOPayComp ? `${FOPayComp.compName}` : 'Unknown Component',
      Amount: item.amount,
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

async function getCtcLetterJsonData(userid) {
  const headers_footers = require("../assets/ctc_headers_footers.json");

  const [User, EmpPayCompsRecurring, FOPayComponents] = await Promise.all([
    Sf_Api.getUserResponse(userid),
    Sf_Api.getEmpPayCompRecurringResponse(userid),
    Sf_Api.getFOPayComponentsResponse()
  ]);

  if (!User) {
    return null;
  }
  const RecurringComps = getPayCompByCompId(EmpPayCompsRecurring, FOPayComponents);

  const company = geEmpCompanyName(User?.custom04);
  const address = getCompanyAddress(headers_footers, company);
  const fileName = headers_footers.find((item) => item.company_name === company)?.file_name || '';
  const formattedDate = formatSAPDateCustom(User?.hireDate);
  const CompanyLogo = await imageToBase64PNG(fileName, "headers_images");
  const signatureImage = await imageToBase64PNG("signature", "signature_images");
  const name = bindSalutationAndName(User?.salutation, User?.displayName);

  let response = {
    version: "1.6",
    generated_on: getFormattedTimestamp(),
    today: getCurrentFormattedDate(),
    joiningDate: formattedDate,
    userId: User?.userId || "",
    name: name,
    designation: User?.title || "",
    company: company,
    signatureName: "Ramu Gajula (Authorized Signatory) \nGM – HR Operations (Comp & Benefits)",
    phone: "+917625041333",
    email: "ramu@prestigeconstructions.com",
    address: address,
    payComponent: RecurringComps || [],
    headerImage: CompanyLogo,
    signatureImage: signatureImage,
  };
  return response;
}

async function getCTC_letter_XML(empData) {
  const parser = new xml2js.Parser({ explicitArray: true });
  const builder = new xml2js.Builder();
  let updatedXML;

  parser.parseString(ctc_xml, (err, result) => {
    if (err) throw err;

    result.data.EMP_CODE[0] = empData.userId;
    result.data.EMP_NAME[0] = empData.name;
    result.data.EMP_DESIG[0] = empData.designation;
    result.data.JOIN_DATE[0] = empData.joiningDate;
    result.data.SYSTEMDATE[0] = empData.today;
    result.data.COMPANY_NAME[0] = empData.company + ",";
    result.data.COMP_LOGO[0] = empData.headerImage;
    result.data.SIGN_NAME[0] = empData.signatureName;
    result.data.SIGN_LOGO[0] = empData.signatureImage;
    result.data.PHONE_TEXT[0] = empData.phone;
    result.data.EMAIL_TEXT[0] = empData.email;
    result.data.PAY_COMP[0].DATA = mapPayComp(empData.payComponent);
    result.data.ADDRESS1[0] = empData.address;
    result.data.GENERATED_ON[0] = empData.generated_on;
    updatedXML = builder.buildObject(result);
  });
  return updatedXML;
}

module.exports = { formatSAPDateCustom, imageToBase64PNG, geEmpCompanyName, bindSalutationAndName, getCompanyAddress, getCurrentFormattedDate, getPayCompByCompId, getCTC_letter_XML, getFormattedTimestamp, getCtcLetterJsonData };  