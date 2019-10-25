import * as React from "react";
import { Header } from "../header/header";
import "./familyTreeThankYouPage.css";
import bhLogo from "../../assets/images/bh-logo-he.svg";

export interface FamilyTreeThankYouPageProps {}

export interface FamilyTreeThankYouPageState {}

class FamilyTreeThankYouPage extends React.Component<
  FamilyTreeThankYouPageProps,
  FamilyTreeThankYouPageState
> {
  render() {
    return (
      <div className="family-tree-thanks-page-container">
        <Header title="העץ שלך נשמר" />
        <div className="family-tree-thanks-body">
          <div className="text-first-part">
            <p>תודה רבה!</p>
            <p>העץ נשמר במאגר עצי משפחה של בית התפוצות.</p>
            <p>
              אתם מוזמנים לבקר במוזיאון העם היהודי בבית התפוצות ולהמשיך ללמוד ,
              לחקור ולהיות חלק מסיפור.
            </p>
          </div>
          <div className="bh-logo-class">
            <img className="bh-logo" alt="Beit Hatfutzot Logo" src={bhLogo} />
          </div>
          <div className="information-boxes-upper">
            <button className="upper-right-box">
              בואו <span className="highlight"> לבקר </span> במוזיאון העם היהודי
            </button>
            <button className="upper-left-box">
              מוזמנים להתרשם ממבחר הפריטים בחנות המוזיאון
            </button>
          </div>
          <div className="information-boxes-lower">
            <button className="lower-right-box">
              בואו <span className="highlight"> ללמוד </span> עם התוכניות
              החינוכיות
            </button>
            <button className="lower-left-box">
              בואו <span className="highlight"> לגלות </span> על העולם היהודי
              במאגרי המידע החינוכיות
            </button>
          </div>
          <div className="information-bar-body">
            <div className="information-bar-line1">
              אודות מאגר עצי המשפחה במוזאון
            </div>
            <div className="information-bar-line2">
              אודות מאגרי המידע של המוזאון
            </div>
            <div className="information-bar-line3">אודות מוזאון העם היהודי</div>
            <div className="information-bar-line4"> אודות פרוייקט זה </div>
          </div>
        </div>
      </div>
    );
  }
}

export { FamilyTreeThankYouPage };
