import * as React from "react";
import { Component } from "react";

import bhLogo from "../../assets/images/bh-logo-he.svg";
import "./homePage.css";
import { ProceedButton } from "../proceedButton/proceedButton";

class HomePage extends Component {
  render() {
    return (
      <div className="home-page-container">
        <div className="home-header">
          <img className="bh-logo" alt="Beit Hatfutzot Logo" src={bhLogo} />
        </div>
        <div className="home-page-body ">
          <div className="welcome-message" tabIndex={1}>
            <span className="part1"> ברוכים הבאים</span>
            <br />
            <span className="part2">
              ל<span className="part2-inner">פרויקט עצי המשפחה</span>
            </span>
            <br /> של מוזיאון העם היהודי בבית התפוצות.
          </div>
          <div className="welcome-explanation" tabIndex={2}>
            כאן תוכלו ליצור את עץ המשפחה שלכם
            <br /> ב-4 צעדים פשוטים.
          </div>
          <div className="vertical-spacer"></div>
          <div className="welcome-disclaimer" tabIndex={3}>
            העץ שתבנו יישמר במאגר עצי המשפחה
            <br /> המאובטח של בית התפוצות ותוכלו לעיין בו
            <br /> ולערוך אותו בעתיד באתר בית התפוצות.
          </div>
          <div className="welcome-cta">
            <ProceedButton text="כניסה" nextPageUrl="/register" tabIndex={4} />
          </div>
        </div>
      </div>
    );
  }
}

export { HomePage };
