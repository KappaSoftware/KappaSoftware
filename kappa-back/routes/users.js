var express = require("express");
var router = express.Router();

var [
  getUsers,
  getUser,
  getUserByUsername,
  login,
  insertUser,
  updateUser,
  deleteUser,
] = require("../controllers/user");

const userLogic = require("../logic/userLogic");

const axios = require("axios");

router.post("/login", async function (req, res, next) {
  try {
    const authUser = await login(req.body);
    authUser.success = true;
    res.send(authUser);
  } catch (error) {
    res.status(200).json({
      success: false,
      message: error.message,
    });
  }
});

/**router.get("/", async function (req, res, next) {
  const users = await getUsers();
  res.send(users);
});

router.get("/:id", async function (req, res, next) {
  const user = await getUser(req.params.id);

  if (user === null)
    return res
      .status(404)
      .send(
        "The user with the given id was not found. " +
          req.params.id +
          typeof req.params.id
      );

  res.send(user);
});*/

router.get("/username", async function (req, res, next) {
  const user = await getUserByUsername(req.body);
  if (user === null)
    return res.status(200).send({
      exists: false,
    });
  user.exists = true;
  res.send(user);
});

router.post("/", async function (req, res, next) {
  const { error } = userLogic.validateUser(req.body);

  if (error) {
    return res.status(200).send({
      create: false,
      message: error.details[0].message,
    });
  }

  const secret_key = process.env.SECRET_CAPTCHA;
  const token = req.body.token;
  const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secret_key}&response=${token}`;

  axios
    .post(url)
    .then(async (google_response) => {
      if (google_response.data.success === true) {
        const newUser = await insertUser(req.body);
        newUser.create = true;
        res.send(newUser);
      } else {
        res.status(200).json({
          create: false,
          message: "El token ya fue usado, realice el CAPTCHA nuevamente.",
        });
      }
    })
    .catch((error) => {
      res.status(200).json({
        create: false,
        message: error.message,
      });
    });
});

/*router.put("/:id", async function (req, res) {
  const { error } = userLogic.validateUser(req.body);

  if (error) {
    return res.status(400).send(error);
  }

  const user = await getUser(req.params.id);

  if (user === null) return res.status(404).send("The user was not found.");

  const newUser = await updateUser(req.params.id, req.body);
  res.send({ user: "User updated" });
});

router.delete("/:id", async function (req, res) {
  const user = await getUser(req.params.id);

  if (user === null) return res.status(404).send("The user was not found.");

  const delUser = await deleteUser(req.params.id);
  res.status(204).send();
});*/

module.exports = router;
