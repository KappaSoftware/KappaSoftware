import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Toolbar from "@material-ui/core/Toolbar";
import NavbarLanding from "./NavbarLandingComponent";
import LandingFooterComponent from "./LandingFooterComponent";
import Grid from "@material-ui/core/Grid";

const useStyles = makeStyles((theme) => ({
  paddingContainer: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
}));

const axios = require("axios");
const urlPrivacyPolicyEn =
  "https://gist.githubusercontent.com/DavidMS73/2a81d86375b6b8ff078fe41d1f58893b/raw/privacyPolicyKappa-en.html";
const urlPrivacyPolicyEs =
  "https://gist.githubusercontent.com/DavidMS73/e64948fb80b8d2dddf3d8662cb152d11/raw/privacyPolicyKappa-es.html";
const urlTermsOfUseEn =
  "https://gist.githubusercontent.com/DavidMS73/be98ee2034cf2e1d2d84ac9fed1ed42b/raw/termsOfUseKappa-en.html";
const urlTermsOfUseEs =
  "https://gist.githubusercontent.com/DavidMS73/518169dba48fc80099f398d15dab982a/raw/termsOfUseKappa-es.html";

export default function DisclaimerComponent({ language, setLanguage }) {
  const [privacyPolicyEn, setPrivacyPolicyEn] = useState();
  const [privacyPolicyEs, setPrivacyPolicyEs] = useState();
  const [termsOfUseEn, setTermsOfUseEn] = useState();
  const [termsOfUseEs, setTermsOfUseEs] = useState();

  useEffect(() => {
    axios
      .get(urlPrivacyPolicyEn)
      .then((response) => {
        setPrivacyPolicyEn(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
    axios
      .get(urlPrivacyPolicyEs)
      .then((response) => {
        setPrivacyPolicyEs(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
    axios
      .get(urlTermsOfUseEn)
      .then((response) => {
        setTermsOfUseEn(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
    axios
      .get(urlTermsOfUseEs)
      .then((response) => {
        setTermsOfUseEs(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  });

  const classes = useStyles();

  return (
    <>
      <NavbarLanding language={language} setLanguage={setLanguage} />
      <Toolbar />
      <Container fixed className={classes.paddingContainer}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <div dangerouslySetInnerHTML={{ __html: privacyPolicyEn }} />
          </Grid>
          <Grid item xs={12} md={6}>
            <div dangerouslySetInnerHTML={{ __html: privacyPolicyEs }} />
          </Grid>
          <Grid item xs={12} md={6}>
            <div dangerouslySetInnerHTML={{ __html: termsOfUseEn }} />
          </Grid>
          <Grid item xs={12} md={6}>
            <div dangerouslySetInnerHTML={{ __html: termsOfUseEs }} />
          </Grid>
        </Grid>
      </Container>

      <LandingFooterComponent />
    </>
  );
}
