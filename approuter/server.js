const xsenv = require('@sap/xsenv');
const approuter = require('@sap/approuter');
const express = require('express');

const ar = approuter();
const app = express();

app.use((req, res, next) => {
  res.cookie('JSESSIONID', '', { maxAge: 60000 }); // 1 minute
  next();
});

app.use(ar);
ar.start();
