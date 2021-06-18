import React from "react";
import LandingFooterAll from "./LandingFooterAllComponent";

export default function LandingFooter() {
  return (
    <section className="landing-footer" id="ldFooterSec">
      <div className="landing-footer-container">
        <h5>Kappa</h5>
        <ul className="list-unstyled">
          <li>CC 4.0 International By</li>
        </ul>

        <img
          src="/assets/images/cc-by-sa-svg.svg"
          className="landing-footer-ccbysa"
          alt="CC-BY-SA"
        />
        <a
          href="https://github.com/KappaSoftware/KappaSoftware"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src="/assets/images/github.png"
            className="landing-footer-btnGitHub"
            alt="Github"
          />
        </a>
        <a
          href="https://t.me/Kappa_PQR"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src="/assets/images/telegram.png"
            className="landing-footer-btnTelegram"
            alt="Telegram"
          />
        </a>
      </div>
      <LandingFooterAll />
    </section>
  );
}
