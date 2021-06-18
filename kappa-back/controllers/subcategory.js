const { mongoUtils, dataBase } = require("../lib/utils/mongo");
const { ObjectId } = require("mongodb");
const COLLECTION_NAME = "Subcategories";

function getSubcategories() {
  return mongoUtils.conn().then((client) => {
    return client
      .db(dataBase)
      .collection(COLLECTION_NAME)
      .find({})
      .toArray()
      .finally(() => client.close());
  });
}

function getSubcategoriesWithCategory(categoryId) {
  return mongoUtils.conn().then((client) => {
    return client
      .db(dataBase)
      .collection(COLLECTION_NAME)
      .find({ Category: ObjectId(categoryId) })
      .toArray()
      .finally(() => client.close());
  });
}

function getSubcategory(subcategoryId) {
  return mongoUtils.conn().then((client) => {
    return client
      .db(dataBase)
      .collection(COLLECTION_NAME)
      .findOne({ _id: ObjectId(subcategoryId) })
      .finally(() => client.close());
  });
}

function insertSubcategory(newSubcategory) {
  return mongoUtils.conn().then((client) => {
    return client
      .db(dataBase)
      .collection(COLLECTION_NAME)
      .insertOne({
        Category: ObjectId(newSubcategory.Category),
        Name_en: newSubcategory.Name_en,
        Name_es: newSubcategory.Name_es,
        Color: newSubcategory.Color,
        creationDate: new Date(),
      })
      .finally(() => client.close());
  });
}

function updateSubcategory(subcategoryId, body) {
  return mongoUtils.conn().then((client) => {
    return client
      .db(dataBase)
      .collection(COLLECTION_NAME)
      .updateOne(
        {
          _id: ObjectId(subcategoryId),
        },
        {
          $set: {
            Category: ObjectId(body.Category),
            Name_en: body.Name_en,
            Name_es: body.Name_es,
            Color: body.Color,
          },
        }
      )
      .finally(() => client.close());
  });
}

function deleteSubcategory(subcategoryId) {
  return mongoUtils.conn().then((client) => {
    client
      .db(dataBase)
      .collection(COLLECTION_NAME)
      .deleteOne({ _id: ObjectId(subcategoryId) })
      .finally(() => client.close());
  });
}

module.exports = [
  getSubcategories,
  getSubcategoriesWithCategory,
  getSubcategory,
  insertSubcategory,
  updateSubcategory,
  deleteSubcategory,
];
