var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
require("dotenv").config();

var usersRouter = require("./routes/users");
var telegramUsersRouter = require("./routes/telegramUsers");
var categoriesRouter = require("./routes/categories");
var subcategoriesRouter = require("./routes/subcategories");
var dataRouter = require("./routes/data");
var landingStatsRouter = require("./routes/landingStats");

var app = express();
console.log("The value of PORT is:", process.env.PORT);
console.log("The env is:", process.env.NODE_ENV);

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "kappa-front/build")));

app.use("/kappa/users", usersRouter);
app.use("/kappa/telegramusers", telegramUsersRouter);
app.use("/kappa/categories", categoriesRouter);
app.use("/kappa/subcategories", subcategoriesRouter);
app.use("/kappa/data", dataRouter);
app.use("/kappa/landing_stats", landingStatsRouter);

/* GET build index */
app.get("/*", function (req, res) {
  res.sendFile(path.join(__dirname, "kappa-front/build", "index.html"));
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
