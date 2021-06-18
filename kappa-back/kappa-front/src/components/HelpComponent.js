import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Toolbar from "@material-ui/core/Toolbar";
import NavbarLanding from "./NavbarLandingComponent";
import LandingFooterComponent from "./LandingFooterComponent";
import { useIntl } from "react-intl";

const useStyles = makeStyles((theme) => ({
  paddingContainer: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
}));

export default function HelpComponent({ language, setLanguage }) {
  const intl = useIntl();

  const classes = useStyles();

  return (
    <>
      <NavbarLanding language={language} setLanguage={setLanguage} />
      <Toolbar />
      <Container fixed className={classes.paddingContainer}>
        <h2>
          {intl.formatMessage({
            id: "landing_navbar_title_help",
          })}
        </h2>
        <p>
          {intl.formatMessage({
            id: "landing_help_all",
          })}
          <a href="https://github.com/KappaSoftware/KappaSoftware"> Kappa</a>.
        </p>
        <p>
          {intl.formatMessage({
            id: "landing_help_telegram",
          })}
          <a href="https://telegram.me/kappa_software_bot">
            {intl.formatMessage({
              id: "landing_help_telegram_here",
            })}
          </a>
          .
        </p>
        <p>
          {intl.formatMessage({
            id: "landing_help_faq",
          })}
          <a href="https://telegram.me/kappa_software_bot">
            {intl.formatMessage({
              id: "landing_help_faq_here",
            })}
          </a>
          .
        </p>
        <p>
          <strong>
            {intl.formatMessage({
              id: "landing_help_warning",
            })}
            <a href="/disclaimer">
              {intl.formatMessage({
                id: "landing_help_warning_here",
              })}
            </a>
            .
          </strong>
        </p>
        <h4>
          {intl.formatMessage({
            id: "landing_help_first_question",
          })}
        </h4>
        <hr />
        <p>
          {intl.formatMessage({
            id: "landing_help_first_answer",
          })}
        </p>
        <h4>
          {intl.formatMessage({
            id: "landing_help_second_question",
          })}
        </h4>
        <hr />
        <p>
          {intl.formatMessage({
            id: "landing_help_second_answer",
          })}
        </p>
        <h4>
          {intl.formatMessage({
            id: "landing_help_third_question",
          })}
        </h4>
        <hr />
        <p>
          {intl.formatMessage({
            id: "landing_help_third_answer",
          })}
        </p>
      </Container>

      <LandingFooterComponent />
    </>
  );
}
