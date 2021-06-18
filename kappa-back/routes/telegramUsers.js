var express = require("express");
var router = express.Router();

var [
  getTelegramUsers,
  getTelegramUserId,
  insertTelegramUser,
  deleteTelegramUser,
] = require("../controllers/telegramUser");

router.get("/", async function (req, res, next) {
  const users = await getTelegramUsers();
  res.send(users);
});

router.get("/:id", async function (req, res, next) {
  const user = await getTelegramUserId(req.params.id);

  if (user === null)
    return res.status(200).send({
      message: "The user with the given id was not found",
      exists: false,
    });

  user.exist = true;
  res.send(user);
});

router.post("/", async function (req, res, next) {
  try {
    const newUser = await insertTelegramUser(req.body);
    newUser.ops[0].create = true;
    res.send(newUser.ops[0]);
  } catch (error) {
    res.status(403).json({
      create: false,
      message: error.message,
    });
  }
});

router.delete("/:id", async function (req, res) {
  const user = await getTelegramUserId(req.params.id);

  if (user === null) return res.status(404).send("The user was not found.");

  const delUser = await deleteTelegramUser(req.params.id);
  res.status(204).send();
});

module.exports = router;
