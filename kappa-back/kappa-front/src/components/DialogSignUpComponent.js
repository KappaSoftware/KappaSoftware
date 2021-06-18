import React, { useState, useRef } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";

import { makeStyles } from "@material-ui/core/styles";
import { useForm, Controller } from "react-hook-form";
import { loginUser, createUser } from "../redux/ActionCreators";
import { useDispatch } from "react-redux";
import Typography from "@material-ui/core/Typography";
import { useHistory } from "react-router";
import { useIntl } from "react-intl";

var Recaptcha = require("react-recaptcha");

const useStyles = makeStyles((theme) => ({
  marginButton: {
    marginTop: theme.spacing(2),
  },
  textError: {
    marginTop: theme.spacing(2),
    color: "#d32f2f",
    whiteSpace: "pre-wrap",
  },
}));

let recaptchaInstance;

const resetRecaptcha = () => {
  recaptchaInstance.reset();
};

export default function DialogSignUp(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const intl = useIntl();
  const password = useRef({});

  const [userError, setUserError] = useState("");

  const [token, setToken] = useState("");

  const [showCreate, setShowCreate] = useState(false);

  const handleCloseDialog = () => {
    props.setOpenDialog(false);
  };

  const {
    handleSubmit,
    control,
    formState: { errors },
    watch,
    reset,
  } = useForm();

  const handleSubmitSignUp = async (data) => {
    data.token = token;
    const userData = await dispatch(createUser(data));
    if (userData.data.create === true) {
      props.setOpenDialog(false);
      reset("username", "password", "repeat_password");
      await setToken("");
      await dispatch(loginUser(data));
      await setShowCreate(false);
      history.push("/map");
    } else {
      await setUserError(userData.data.message);
      await resetRecaptcha();
    }
  };

  password.current = watch("password");

  // Función que se ejecutará después de recibir el token.
  var callback = function () {
    console.log("Token created");
  };

  // Recibimos el token y almacenamos su respuesta en un estado con el hook useState.
  var verifyCallback = function (response) {
    setToken(response);
    setShowCreate(true);
  };

  return (
    <div>
      <Dialog
        open={props.openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">
          {intl.formatMessage({
            id: "map_navbar_title_signup",
          })}
        </DialogTitle>
        <DialogContent>
          <form
            noValidate
            onSubmit={handleSubmit((data) => handleSubmitSignUp(data))}
          >
            <Controller
              control={control}
              name="username"
              defaultValue=""
              rules={{
                required: intl.formatMessage({
                  id: "dialog_required",
                }),
                minLength: {
                  value: 5,
                  message: intl.formatMessage({
                    id: "dialog_signup_username_min",
                  }),
                },
                maxLength: {
                  value: 30,
                  message: intl.formatMessage({
                    id: "dialog_signup_username_max",
                  }),
                },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  autoFocus
                  required
                  margin="dense"
                  label={intl.formatMessage({
                    id: "dialog_signup_username",
                  })}
                  fullWidth
                  error={errors.username ? true : false}
                  helperText={errors.username ? errors.username.message : ""}
                />
              )}
            />
            <Controller
              control={control}
              name="password"
              defaultValue=""
              rules={{
                required: intl.formatMessage({
                  id: "dialog_required",
                }),
                minLength: {
                  value: 5,
                  message: intl.formatMessage({
                    id: "dialog_signup_password_min",
                  }),
                },
                maxLength: {
                  value: 30,
                  message: intl.formatMessage({
                    id: "dialog_signup_password_max",
                  }),
                },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  ref={password}
                  margin="dense"
                  required
                  label={intl.formatMessage({
                    id: "dialog_signup_password",
                  })}
                  type="password"
                  fullWidth
                  error={errors.password ? true : false}
                  helperText={errors.password ? errors.password.message : ""}
                />
              )}
            />
            <Controller
              control={control}
              name="repeat_password"
              defaultValue=""
              rules={{
                required: intl.formatMessage({
                  id: "dialog_required",
                }),
                minLength: {
                  value: 5,
                  message: intl.formatMessage({
                    id: "dialog_signup_password_min",
                  }),
                },
                maxLength: {
                  value: 30,
                  message: intl.formatMessage({
                    id: "dialog_signup_password_max",
                  }),
                },
                validate: (value) =>
                  value === password.current || "The passwords do not match",
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  margin="dense"
                  required
                  label={intl.formatMessage({
                    id: "dialog_signup_password_again",
                  })}
                  type="password"
                  fullWidth
                  error={errors.repeat_password ? true : false}
                  helperText={
                    errors.repeat_password ? errors.repeat_password.message : ""
                  }
                />
              )}
            />

            <Typography
              variant="body1"
              component="h3"
              className={classes.textError}
            >
              {userError}
            </Typography>

            <Recaptcha
              sitekey={process.env.REACT_APP_SITEKEY_CAPTCHA}
              theme="dark"
              verifyCallback={verifyCallback}
              onloadCallback={callback}
              ref={(e) => (recaptchaInstance = e)}
            />

            {showCreate ? (
              <Button
                type="submit"
                color="secondary"
                variant="contained"
                className={classes.marginButton}
              >
                {intl.formatMessage({
                  id: "dialog_signup_submit",
                })}
              </Button>
            ) : (
              <></>
            )}
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            {intl.formatMessage({
              id: "dialog_signup_cancel",
            })}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
