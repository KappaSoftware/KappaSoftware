var express = require("express");
var router = express.Router();

var [
  getCategories,
  getCategory,
  getCategoryLookupSubcategories,
  insertCategory,
  updateCategory,
  deleteCategory,
] = require("../controllers/category");

router.get("/", async function (req, res, next) {
  const categories = await getCategories();
  res.send(categories);
});

router.get("/:id", async function (req, res, next) {
  const category = await getCategory(req.params.id);

  if (category === null)
    return res
      .status(404)
      .send(
        "The category with the given id was not found. " +
          req.params.id +
          typeof req.params.id
      );

  res.send(category);
});

router.get("/lookup/subcategory", async function (req, res, next) {
  const data = await getCategoryLookupSubcategories();

  if (data === null) return res.status(404).send("The data was not found");

  res.send(data);
});

router.post("/", async function (req, res, next) {
  const newCategory = await insertCategory(req.body);
  res.send(newCategory);
});

router.put("/:id", async function (req, res) {
  const category = await getCategory(req.params.id);

  if (category === null)
    return res.status(404).send("The category was not found.");

  const newCategory = await updateCategory(req.params.id, req.body);
  res.send({ category: "Category updated" });
});

router.delete("/:id", async function (req, res) {
  const category = await getCategory(req.params.id);

  if (category === null)
    return res.status(404).send("The category was not found.");

  const delCategory = await deleteCategory(req.params.id);
  res.status(204).send();
});

module.exports = router;
