const { mongoUtils, dataBase } = require("../lib/utils/mongo");
const { ObjectId } = require("mongodb");
const COLLECTION_NAME = "Data";
const COLLECTION_SUBCATEGORY_NAME = "Subcategories";

function getTotalData() {
  return mongoUtils.conn().then((client) => {
    return client
      .db(dataBase)
      .collection(COLLECTION_NAME)
      .find({})
      .toArray()
      .finally(() => client.close());
  });
}

function getDataFiltered() {
  return mongoUtils.conn().then((client) => {
    return client
      .db(dataBase)
      .collection(COLLECTION_NAME)
      .find({ complaints: { $lt: 3 } })
      .toArray()
      .finally(() => client.close());
  });
}

function getTotalDataLookupSubcategory() {
  return mongoUtils.conn().then((client) => {
    return client
      .db(dataBase)
      .collection(COLLECTION_NAME)
      .aggregate([
        {
          $lookup: {
            from: COLLECTION_SUBCATEGORY_NAME,
            localField: "properties.Subcategory",
            foreignField: "_id",
            as: "properties.Subcategory",
          },
        },
      ])
      .toArray()
      .finally(() => client.close());
  });
}

function getDataWithSubcategory(subcategoryId) {
  return mongoUtils.conn().then((client) => {
    return client
      .db(dataBase)
      .collection(COLLECTION_NAME)
      .find({ "properties.Subcategory": ObjectId(subcategoryId) })
      .toArray()
      .finally(() => client.close());
  });
}

function getDataWithSubcategoryLookupSubcategory(subcategoryId) {
  return mongoUtils.conn().then((client) => {
    return client
      .db(dataBase)
      .collection(COLLECTION_NAME)
      .aggregate([
        {
          $match: {
            "properties.Subcategory": ObjectId(subcategoryId),
            complaints: { $lt: 3 },
          },
        },
        {
          $lookup: {
            from: COLLECTION_SUBCATEGORY_NAME,
            localField: "properties.Subcategory",
            foreignField: "_id",
            as: "properties.Subcategory",
          },
        },
      ])
      .toArray()
      .finally(() => client.close());
  });
}

function getOneData(dataId) {
  return mongoUtils.conn().then((client) => {
    return client
      .db(dataBase)
      .collection(COLLECTION_NAME)
      .findOne({ _id: ObjectId(dataId) })
      .finally(() => client.close());
  });
}

function insertData(newData) {
  return mongoUtils.conn().then((client) => {
    return client
      .db(dataBase)
      .collection(COLLECTION_NAME)
      .insertOne({
        type: "Feature",
        properties: {
          Subcategory: ObjectId(newData.properties.Subcategory),
          Popup_en: newData.properties.Popup_en,
          Popup_es: newData.properties.Popup_es,
        },
        geometry: {
          type: "Point",
          coordinates: newData.geometry.coordinates,
        },
        complaints: 0,
        complaintsUsers: [],
        creationDate: new Date(),
      })
      .finally(() => client.close());
  });
}

async function insertComplaint(dataId, userReportId) {
  const data = await getOneData(dataId);

  data.complaints += 1;
  if (userReportId === undefined) {
    throw new Error("El usuario que reporta no puede estar vacío");
  }

  data.complaintsUsers.forEach((element) => {
    if (element.toString() === userReportId) {
      throw new Error("Un usuario no puede reportar 2 veces el mismo punto");
    }
  });
  data.complaintsUsers.push(ObjectId(userReportId));

  return updateData(dataId, data);
}

function updateData(dataId, body) {
  return mongoUtils.conn().then((client) => {
    return client
      .db(dataBase)
      .collection(COLLECTION_NAME)
      .updateOne(
        {
          _id: ObjectId(dataId),
        },
        {
          $set: {
            type: body.Name_en,
            properties: {
              Subcategory: ObjectId(body.properties.Subcategory),
              Popup_en: body.properties.Popup_en,
              Popup_es: body.properties.Popup_es,
            },
            geometry: {
              type: "Point",
              coordinates: body.geometry.coordinates,
            },
            complaints: body.complaints,
            complaintsUsers: body.complaintsUsers,
          },
        }
      )
      .finally(() => client.close());
  });
}

function deleteData(dataId) {
  return mongoUtils.conn().then((client) => {
    client
      .db(dataBase)
      .collection(COLLECTION_NAME)
      .deleteOne({ _id: ObjectId(dataId) })
      .finally(() => client.close());
  });
}

module.exports = [
  getTotalData,
  getDataFiltered,
  getTotalDataLookupSubcategory,
  getDataWithSubcategory,
  getDataWithSubcategoryLookupSubcategory,
  getOneData,
  insertData,
  insertComplaint,
  updateData,
  deleteData,
];
