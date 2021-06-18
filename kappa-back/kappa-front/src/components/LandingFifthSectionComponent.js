import React from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import { useIntl } from "react-intl";
import { Element } from "react-scroll";

export default function LandingFifththSection() {
  const intl = useIntl();
  return (
    <Element name="ldFifthSec">
      <section className="landing-fifthsection">
        <Container fluid>
          <Row>
            <Col xs={12} sm={6} className="p-0">
              <div className="landing-fifthsection-div-first"></div>
              <div className="landing-fifthsection-title">
                <h3>
                  {intl.formatMessage({
                    id: "landing_fifth_section_category_one",
                  })}
                </h3>
              </div>
            </Col>
            <Col xs={12} sm={6} className="p-0">
              <div className="landing-fifthsection-div-second"></div>
              <div className="landing-fifthsection-title">
                <h3>
                  {intl.formatMessage({
                    id: "landing_fifth_section_category_two",
                  })}
                </h3>
              </div>
            </Col>
            <Col xs={12} sm={6} className="p-0">
              <div className="landing-fifthsection-div-third"></div>
              <div className="landing-fifthsection-title">
                <h3>
                  {intl.formatMessage({
                    id: "landing_fifth_section_category_three",
                  })}
                </h3>
              </div>
            </Col>
            <Col xs={12} sm={6} className="p-0">
              <div className="landing-fifthsection-div-fourth"></div>
              <div className="landing-fifthsection-title">
                <h3>
                  {intl.formatMessage({
                    id: "landing_fifth_section_category_fourth",
                  })}
                </h3>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </Element>
  );
}
