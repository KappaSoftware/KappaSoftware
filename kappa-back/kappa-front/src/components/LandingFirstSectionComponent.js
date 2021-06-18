import React from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Carousel from "react-bootstrap/Carousel";
import { NavLink } from "react-router-dom";
import { useIntl } from "react-intl";
import { Element } from "react-scroll";

export default function LandingFirstSection() {
  const intl = useIntl();

  return (
    <Element name="ldFirstSec">
      <section className="landing-firstsection">
        <Container fluid>
          <Row className="landing-firstsection-row row-align-itemvertical">
            <Col className="landing-firstsection-col pr-0 pl-0">
              <div className="landing-firstsection-carousel">
                <Carousel indicators={false}>
                  <Carousel.Item interval={3000}>
                    <img
                      className="d-block w-100 landing-firstsection-imageCarousel"
                      src="/assets/images/LandingFirstSection-HandsMap.jpg"
                      alt="First slide"
                    />
                  </Carousel.Item>
                  <Carousel.Item interval={3000}>
                    <img
                      className="d-block w-100 landing-firstsection-imageCarousel"
                      src="/assets/images/LandingFirstSection-GPSHand.jpg"
                      alt="Second slide"
                    />
                  </Carousel.Item>
                  <Carousel.Item interval={3000}>
                    <img
                      className="d-block w-100 landing-firstsection-imageCarousel"
                      src="/assets/images/LandingFirstSection-HandPic.jpg"
                      alt="Third slide"
                    />
                  </Carousel.Item>
                </Carousel>
              </div>
              <div className="landing-firstsection-divText">
                <h1 className="text-color-white landing-firstsection-titleText">
                  {intl.formatMessage({ id: "landing_first_section_title" })}
                </h1>
                <NavLink to="/map">
                  <Button
                    variant="outline-light"
                    className="landing-firstsection-buttonSignUp"
                  >
                    {intl.formatMessage({ id: "landing_first_section_button" })}
                  </Button>
                </NavLink>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </Element>
  );
}
