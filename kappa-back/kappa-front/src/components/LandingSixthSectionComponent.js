import React from "react";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import { useIntl } from "react-intl";
import { Element } from "react-scroll";

export default function LandingSixthSection() {
  const intl = useIntl();
  return (
    <Element name="ldSixthSec">
      <section className="landing-sixthsection" id="ldSixthSec">
        <Container fluid>
          <Row className="landing-sixthsection-row">
            <h2 className="landing-sixthsection-text">
              {intl.formatMessage({
                id: "landing_sixth_section_description",
              })}
            </h2>
          </Row>
        </Container>
      </section>
    </Element>
  );
}
