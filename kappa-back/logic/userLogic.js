const Joi = require("joi");

const validateUser = (user) => {
  const schema = Joi.object({
    username: Joi.string().alphanum().min(5).max(30).required().messages({
      "string.min":
        "You must use a minimum of 5 characters in the username.\n\nDebe usar  mínimo 3 caracteres en el nombre de usuario.",
      "string.max":
        "You must use a maximum of 30 characters in the username.\n\nDebe usar  máximo 30 caracteres en el nombre de usuario.",
    }),
    password: Joi.string()
      .pattern(new RegExp("^[a-zA-Z0-9#?!@$%^&*-]{5,30}$"))
      .required()
      .messages({
        "string.pattern.base":
          "Incorrect password pattern. You must only use letters, numbers or special characters (#?!@$%^&*-) and you must use between 5 and 30 characters. \n\nPatrón de contraseña incorrecto. Solo debe usar letras, números o caracteres especiales (#?!@$%^&*-) y debe usar entre 3 y 30 caracteres.",
      }),
    repeat_password: Joi.ref("password"),
    token: Joi.required(),
    tACTelegram: Joi.optional(),
  })
    .with("password", "repeat_password")
    .messages({
      "any.only": "Passwords must match. \n\nLas contraseñas deben coincidir.",
    });

  return schema.validate(user);
};

exports.validateUser = validateUser;
