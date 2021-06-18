var express = require("express");
var router = express.Router();

var [
  getUsersNumber,
  getCategoriesNumber,
  getDataNumber,
] = require("../controllers/landingStat");

router.get("/", async function (req, res, next) {
  const usersNumber = await getUsersNumber();
  const categoriesNumber = await getCategoriesNumber();
  const dataNumber = await getDataNumber();

  res.send({
    users: usersNumber,
    categories: categoriesNumber,
    points: dataNumber,
  });
});

module.exports = router;
