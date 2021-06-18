var express = require("express");
var router = express.Router();

var [
  getSubcategories,
  getSubcategoriesWithCategory,
  getSubcategory,
  insertSubcategory,
  updateSubcategory,
  deleteSubcategory,
] = require("../controllers/subcategory");

function getRandomColor() {
  var letters = "0123456789ABCDEF";
  var color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

router.get("/", async function (req, res, next) {
  const categories = await getSubcategories();
  res.send(categories);
});

router.get("/category/:id", async function (req, res, next) {
  const subcategories = await getSubcategoriesWithCategory(req.params.id);

  if (subcategories === null)
    return res
      .status(404)
      .send(
        "The subcategory with the given category id was not found. " +
          req.params.id +
          typeof req.params.id
      );

  res.send(subcategories);
});

router.get("/:id", async function (req, res, next) {
  const subcategory = await getSubcategory(req.params.id);

  if (subcategory === null)
    return res
      .status(404)
      .send(
        "The subcategory with the given id was not found. " +
          req.params.id +
          typeof req.params.id
      );

  res.send(subcategory);
});

router.post("/", async function (req, res, next) {
  const newSub = req.body;
  newSub.Color = await getRandomColor();
  const newSubcategory = await insertSubcategory(newSub);
  res.send(newSubcategory);
});

router.put("/:id", async function (req, res) {
  const subcategory = await getSubcategory(req.params.id);
  if (subcategory === null)
    return res.status(404).send("The subcategory was not found.");

  const newSub = req.body;
  newSub.Color = await getRandomColor();
  const newSubcategory = await updateSubcategory(req.params.id, newSub);
  res.send({ subcategory: "Subcategory updated" });
});

router.delete("/:id", async function (req, res) {
  const subcategory = await getSubcategory(req.params.id);

  if (subcategory === null)
    return res.status(404).send("The subcategory was not found.");

  const delSubcategory = await deleteSubcategory(req.params.id);
  res.status(204).send();
});

module.exports = router;
