import React from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import { makeStyles } from "@material-ui/core/styles";
import YouTubeIcon from "@material-ui/icons/YouTube";
import { useIntl } from "react-intl";
import { useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";

const useStyles = makeStyles((theme) => ({
  backgroundThird: {
    backgroundColor: "#2b5566e6",
    borderRadius: "10px",
    padding: "10px",
    color: "white",
  },

  noMargin: {
    margin: 0,
  },
}));

export default function LandingSecondSection() {
  const classes = useStyles();
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down("sm"));

  const intl = useIntl();
  return (
    <section className="landing-secondsection" id="ldSecondSec">
      <Container fluid>
        <Row>
          <div className="hidden-xs col-sm-2" />
          <Col className="landing-secondsection-col">
            <img src="/assets/images/agpl.png" alt="AGPL" />
          </Col>
          <Col className="landing-secondsection-col">
            <img src="/assets/images/cc-by-sa.png" alt="CC-BY-SA" />
          </Col>
          <Col className="landing-secondsection-col">
            <a
              href="https://youtu.be/vVXgsnkYZPs"
              target="_blank"
              rel="noreferrer"
            >
              <div className={classes.backgroundThird}>
                {matches ? (
                  <p className={classes.noMargin}>
                    {intl.formatMessage({ id: "landing_second_section_first" })}
                  </p>
                ) : (
                  <>
                    <p className={classes.noMargin}>
                      {intl.formatMessage({
                        id: "landing_second_section_first_opt2",
                      })}
                    </p>
                    <YouTubeIcon />
                  </>
                )}
              </div>
            </a>
          </Col>
          <div className="hidden-xs col-sm-2" />
        </Row>
      </Container>
    </section>
  );
}
