const { mongoUtils, dataBase } = require("../lib/utils/mongo");
const COLLECTION_CATEGORY_NAME = "Categories";
const COLLECTION_DATA_NAME = "Data";
const COLLECTION_USERS_NAME = "Users";

function getUsersNumber() {
  return mongoUtils.conn().then((client) => {
    return client
      .db(dataBase)
      .collection(COLLECTION_USERS_NAME)
      .find({})
      .count()
      .finally(() => client.close());
  });
}

function getCategoriesNumber() {
  return mongoUtils.conn().then((client) => {
    return client
      .db(dataBase)
      .collection(COLLECTION_CATEGORY_NAME)
      .find({})
      .count()
      .finally(() => client.close());
  });
}

function getDataNumber() {
  return mongoUtils.conn().then((client) => {
    return client
      .db(dataBase)
      .collection(COLLECTION_DATA_NAME)
      .find({})
      .count()
      .finally(() => client.close());
  });
}

module.exports = [getUsersNumber, getCategoriesNumber, getDataNumber];
