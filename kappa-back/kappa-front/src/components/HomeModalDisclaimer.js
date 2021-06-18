import React, { useState, useEffect } from "react";

import Modal from "react-bootstrap/Modal";

import Button from "react-bootstrap/Button";
import { useHistory } from "react-router";

const axios = require("axios");
const urlDisclaimer =
  "https://gist.githubusercontent.com/DavidMS73/2a81d86375b6b8ff078fe41d1f58893b/raw/disclaimerKappa.html";

export default function ModalDisclaimer() {
  let history = useHistory();
  const [disclaimerData, setDisclaimerData] = useState();
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleExit = () => history.push("/home");

  useEffect(() => {
    axios
      .get(urlDisclaimer)
      .then((response) => {
        setDisclaimerData(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  });

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Disclaimer
      </Button>

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        dialogClassName="modal-90w"
        aria-labelledby="example-custom-modal-styling-title"
      >
        <Modal.Header>
          <Modal.Title id="example-custom-modal-styling-title">
            Disclaimer
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div dangerouslySetInnerHTML={{ __html: disclaimerData }}></div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleExit}>
            Exit
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Accept terms and conditions
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
