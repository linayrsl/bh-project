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
              <a
                className="upper-right-box information-box"
                href="https://www.bh.org.il/"
              >
                בואו <span className="highlight"> לבקר </span> במוזיאון העם
                היהודי
              </a>
              <a
                className="upper-left-box information-box"
                href="https://www.bh.org.il/shop/"
              >
                מוזמנים להתרשם ממבחר הפריטים בחנות המוזיאון
              </a>
            </div>
            <div className="information-boxes-lower">
              <a
                className="lower-right-box information-box"
                href="https://www.bh.org.il/education-homepage/"
              >
                בואו <span className="highlight"> ללמוד </span> עם התוכניות
                החינוכיות
              </a>
              <a
                className="lower-left-box information-box"
                href="https://dbs.bh.org.il/"
              >
                בואו <span className="highlight"> לגלות </span> על העולם היהודי
                במאגרי המידע
              </a>
            </div>
            <div className="information-bar-body">
              <div className="information-bar">
                <div className="line-style">
                  {" "}
                  אודות מאגר עצי המשפחה במוזאון{" "}
                </div>
                <div className="text-line1">
                  {" "}
                  מעל ל-5 מיליוני בני אדם כבר רשומים במרכז לגנאלוגיה יהודית בבית
                  התפוצות, והמאגר גדל מדי יום ומדי שעה. מבקרים ממגוון מקומות
                  ואורחות חיים באים להתחקות אחר שורשיהם, לתעד ולהנציח את אילן
                  משפחתם עבור הדורות הבאים, ובכך הם מוסיפים עוד ענף לאילן
                  המשפחתי הגדול של העם היהודי.
                </div>
              </div>
              <div className="information-bar">
                <div className="line-style"> אודות מאגרי המידע של המוזאון</div>
                <div className="text-line2">
                  במוזיאון העם היהודי בבית התפוצות מאגרי מידע מגוונים ועשירים.
                  אילנות יוחסין (עצי משפחה), פירושים לשמות משפחה, תולדותיהן של
                  קהילות ברחבי העולם, צילומים, תמונות וסרטים, קטעי מוזיקה, מידע
                  על מושגים ואישים – כל החומרים נמצאים באתר אחד, עם חיפוש שמאגם
                  את סוגי התוכן וגם מקשר ביניהם בקישורים פנימיים.
                </div>
              </div>
              <div className="information-bar">
                <div className="line-style">אודות מוזאון העם היהודי</div>
                <div className="text-line3">
                  מוזיאון העם היהודי בבית התפוצות הוא מוסד עולמי שמספר על תרבות
                  אחת רבת-פנים, עשירה ועתירת רבדים; הוא מספר על אנשים ונשים, על
                  מבוגרים וילדים, על משפחות וקהילות, על השנה העברית ומועדיה, על
                  תלאות ושמחות, ועל פירות הרוח, החינוך והיצירה, המסורות ואורחות
                  החיים של העם היהודי, אשר נוצרו במגוון ארצות, בכל מיני תקופות,
                  תחת שליטים ומשטרים שונים, ובשבעים לשונות, במשך אלפי שנים.
                  במוזיאון העם היהודי מתואר העם היהודי, עם בקרב עמים אחרים, אשר
                  שומר ומטפח גם קשר מיוחד אל ארץ ישראל ואל מדינת ישראל.
                </div>
              </div>
              <div className="information-bar">
                <div className="line-style"> אודות פרוייקט זה </div>
                <div className="text-line4">
                  פרויקט עצי המשפחה הוקם ע"מ לאפשר את הגדלת מאגר עצי המשפחה של
                  העם היהודי ומתוך מטרה להנגיש את איסוף פרטי המשפחה בצורה נוחה
                  וידידותית למשתמשים דרך הטלפון הנייד. הפרויקט נעשה בשיתוף עם
                  ארגון she codes; ששם לו למטרה לקדם נשים במגזר ההייטק, ונוהל
                  ע"י מחלקת הדיגיטל של מוזאון העם היהודי בבית התפוצות.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export { FamilyTreeThankYouPage };
