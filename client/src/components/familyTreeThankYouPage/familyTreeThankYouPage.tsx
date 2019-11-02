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
          <div className="page-content-container information">
            <div className="bh-logo-class">
              <img className="bh-logo" alt="Beit Hatfutzot Logo" src={bhLogo} />
            </div>
            <div className="information-boxes-upper">
              <a className="upper-right-box information-box">
                בואו <span className="highlight"> לבקר </span> במוזיאון העם
                היהודי
              </a>
              <a className="upper-left-box information-box">
                מוזמנים להתרשם ממבחר הפריטים בחנות המוזיאון
              </a>
            </div>
            <div className="information-boxes-lower">
              <a className="lower-right-box information-box">
                בואו <span className="highlight"> ללמוד </span> עם התוכניות
                החינוכיות
              </a>
              <a className="lower-left-box information-box">
                בואו <span className="highlight"> לגלות </span> על העולם היהודי
                במאגרי המידע
              </a>
            </div>
            <div className="information-bar-body">
              <div className="information-bar">
                אודות מאגר עצי המשפחה במוזאון
              </div>
              <div className="information-bar">
                אודות מאגרי המידע של המוזאון
              </div>
              <div className="information-bar">אודות מוזאון העם היהודי</div>
              <div className="information-bar"> אודות פרוייקט זה </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export { FamilyTreeThankYouPage };
