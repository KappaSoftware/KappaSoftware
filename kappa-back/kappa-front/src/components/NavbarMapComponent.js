import React, { useState, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import DialogLogin from "./DialogLoginComponent";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { logoutUser } from "../redux/ActionCreators";
import DialogSignUp from "./DialogSignUpComponent";
import clsx from "clsx";
import { useIntl } from "react-intl";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Grow from "@material-ui/core/Grow";
import Paper from "@material-ui/core/Paper";
import Popper from "@material-ui/core/Popper";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";

const useStyles = makeStyles((theme) => ({
  title: {
    flexGrow: 1,
  },
  marginRightButton: {
    marginRight: theme.spacing(1),
  },
  alignRight: {
    textAlign: "right",
  },
  paperOption: {
    zIndex: 500,
  },
  marginRightLanguage: {
    marginRight: theme.spacing(1),
  },
  paddingToolbar: {
    padding: "0px 10px 0px 10px",
  },
}));

const options = ["Español", "English"];

export default function NavbarMap({
  language,
  handleLanguageChange,
  handleToggleSidebar,
}) {
  const intl = useIntl();

  const classes = useStyles();

  const dataLogin = useSelector((state) => state.login);

  const [openDialog, setOpenDialog] = useState(false);

  const handleClickOpenDialog = () => {
    setOpenDialog(true);
  };

  const [openDialogSignUp, setOpenDialogSignUp] = useState(false);

  const handleClickOpenDialogSignUp = () => {
    setOpenDialogSignUp(true);
  };

  const dispatch = useDispatch();

  const handleClickClose = () => {
    dispatch(logoutUser());
  };

  const [openOptions, setOpenOptions] = useState(false);
  const anchorRef = useRef(null);
  const [selectedIndex, setSelectedIndex] = useState(language === "es" ? 0 : 1);

  const handleMenuItemClick = (event, index) => {
    setSelectedIndex(index);
    handleLanguageChange(index === 0 ? "es" : "en");
    setOpenOptions(false);
  };

  const handleToggleOptions = () => {
    setOpenOptions((prevOpen) => !prevOpen);
  };

  const handleCloseOptions = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpenOptions(false);
  };

  let buttonLoginOrUsername = (
    <>
      <Button
        variant="outlined"
        color="primary"
        onClick={handleClickOpenDialog}
        className={classes.marginRightButton}
      >
        {intl.formatMessage({
          id: "map_navbar_title_login",
        })}
      </Button>
      <Button
        variant="outlined"
        color="secondary"
        onClick={handleClickOpenDialogSignUp}
      >
        {intl.formatMessage({
          id: "map_navbar_title_signup",
        })}
      </Button>
    </>
  );

  if (dataLogin.token !== "") {
    buttonLoginOrUsername = (
      <>
        <Typography
          variant="subtitle1"
          component="span"
          className={clsx(classes.marginRightButton, classes.alignRight)}
        >
          {intl.formatMessage({
            id: "map_navbar_title_welcome",
          })}{" "}
          {dataLogin.username}
        </Typography>
        <Button variant="outlined" color="primary" onClick={handleClickClose}>
          {intl.formatMessage({
            id: "map_navbar_title_logout",
          })}
        </Button>
      </>
    );
  }

  return (
    <>
      <AppBar position="static" color="default">
        <Toolbar className={classes.paddingToolbar}>
          <IconButton
            edge="start"
            className={"btn-toggle"}
            color="primary"
            aria-label="menu"
            onClick={() => handleToggleSidebar(true)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            {intl.formatMessage({
              id: "map_navbar_title_map",
            })}
          </Typography>

          <ButtonGroup
            variant="text"
            color="primary"
            ref={anchorRef}
            aria-label="Language"
            className={classes.marginRightLanguage}
          >
            <Button>{options[selectedIndex]}</Button>
            <Button
              color="primary"
              size="small"
              aria-controls={openOptions ? "Language menu" : undefined}
              aria-expanded={openOptions ? "true" : undefined}
              aria-label="Select language"
              aria-haspopup="menu"
              onClick={handleToggleOptions}
            >
              <ArrowDropDownIcon />
            </Button>
          </ButtonGroup>
          <Popper
            open={openOptions}
            anchorEl={anchorRef.current}
            role={undefined}
            transition
            disablePortal
            className={classes.paperOption}
          >
            {({ TransitionProps, placement }) => (
              <Grow
                {...TransitionProps}
                style={{
                  transformOrigin:
                    placement === "bottom" ? "center top" : "center bottom",
                }}
              >
                <Paper>
                  <ClickAwayListener onClickAway={handleCloseOptions}>
                    <MenuList id="split-button-menu">
                      {options.map((option, index) => (
                        <MenuItem
                          key={option}
                          selected={index === selectedIndex}
                          onClick={(event) => handleMenuItemClick(event, index)}
                        >
                          {option}
                        </MenuItem>
                      ))}
                    </MenuList>
                  </ClickAwayListener>
                </Paper>
              </Grow>
            )}
          </Popper>
          {buttonLoginOrUsername}
        </Toolbar>
      </AppBar>
      <DialogLogin openDialog={openDialog} setOpenDialog={setOpenDialog} />
      <DialogSignUp
        openDialog={openDialogSignUp}
        setOpenDialog={setOpenDialogSignUp}
      />
    </>
  );
}
