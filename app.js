/** BizTime express application. */


const express = require("express");

const app = express();
const ExpressError = require("./expressError");

app.use(express.json());

const cRoutes = require("./routes/companies");
const iRoutes = require("./routes/invoices");
const industRoutes = require("./routes/industries");
app.use("/companies", cRoutes);
app.use("/invoices", iRoutes);
app.use("/industries", industRoutes);

/** 404 handler */

app.use(function(req, res, next) {
  const err = new ExpressError("Not Found", 404);
  return next(err);
});

/** general error handler */

app.use((err, req, res, next) => {
  res.status(err.status || 500);

  return res.json({
    error: err,
    message: err.message
  });
});


module.exports = app;
