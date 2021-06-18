import React from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import { useIntl } from "react-intl";
import { FaGithub } from "react-icons/fa";
import { Element } from "react-scroll";

export default function LandingFourthSection() {
  const intl = useIntl();
  return (
    <Element name="ldFourthSec">
      <section className="landing-fourthsection">
        <Container fluid>
          <Row>
            <Col xl={6} md={12}>
              <div className="landing-fourthsection-divText">
                <h2>
                  {intl.formatMessage({ id: "landing_fourth_section_title" })}
                </h2>
                <br />
                <p>
                  {intl.formatMessage({
                    id: "landing_fourth_section_description_one",
                  })}
                </p>
                <p>
                  {intl.formatMessage({
                    id: "landing_fourth_section_description_two",
                  })}
                </p>
                <div
                  className="landing-fourthsection-a"
                  style={{
                    padding: "20px 24px",
                  }}
                >
                  <a
                    href="https://github.com/KappaSoftware/KappaSoftware"
                    target="_blank"
                    className="landing-fourthsection-btnGitHub"
                    rel="noopener noreferrer"
                  >
                    <FaGithub /> {intl.formatMessage({ id: "title" })}
                  </a>
                </div>
              </div>
            </Col>
            <Col xl={6} md={12} className="landing-fourthsection-col">
              <div className="landing-fourthsection-div" />
            </Col>
          </Row>
        </Container>
      </section>
    </Element>
  );
}
