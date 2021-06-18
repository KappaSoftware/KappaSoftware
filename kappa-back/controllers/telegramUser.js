const { mongoUtils, dataBase } = require("../lib/utils/mongo");
const COLLECTION_NAME = "TelegramUsers";
var hash = require("object-hash");

function getTelegramUsers() {
  return mongoUtils.conn().then((client) => {
    return client
      .db(dataBase)
      .collection(COLLECTION_NAME)
      .find({})
      .toArray()
      .finally(() => client.close());
  });
}

async function getTelegramUserId(userId) {
  const requestedUserId = await hash(userId, {
    algorithm: "sha1",
    encoding: "hex",
  });
  return mongoUtils.conn().then((client) => {
    return client
      .db(dataBase)
      .collection(COLLECTION_NAME)
      .findOne({ idTelegram: requestedUserId })
      .finally(() => client.close());
  });
}

async function insertTelegramUser(user) {
  const requestedUserId = await hash(user.idTelegram, {
    algorithm: "sha1",
    encoding: "hex",
  });
  const requestedUser = await getTelegramUserId(user.idTelegram);

  if (requestedUser !== null) {
    throw new Error("El usuario ya existe");
  }
  return mongoUtils.conn().then(async (client) => {
    return client
      .db(dataBase)
      .collection(COLLECTION_NAME)
      .insertOne({
        idTelegram: requestedUserId,
        creationDate: new Date(),
      })
      .finally(() => client.close());
  });
}

async function deleteTelegramUser(userId) {
  const requestedUserId = await hash(userId, {
    algorithm: "sha1",
    encoding: "hex",
  });

  return mongoUtils.conn().then((client) => {
    return client
      .db(dataBase)
      .collection(COLLECTION_NAME)
      .deleteOne({ idTelegram: requestedUserId })
      .finally(() => client.close());
  });
}
module.exports = [
  getTelegramUsers,
  getTelegramUserId,
  insertTelegramUser,
  deleteTelegramUser,
];
