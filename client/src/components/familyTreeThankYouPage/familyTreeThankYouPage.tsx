import * as React from "react";
import ClipboardJS from "clipboard";
import { i18n } from "../../i18n";
import {Trans, WithTranslation, withTranslation} from 'react-i18next';

import {
  EmailIcon,
  EmailShareButton,
  FacebookIcon,
  FacebookShareButton,
  TelegramIcon,
  TelegramShareButton,
  TwitterIcon,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from "react-share";

import { Header } from "../header/header";
import "./familyTreeThankYouPage.scss";
import bhLogoHe from "../../assets/images/bh-logo-he.svg";
import bhLogoEn from "../../assets/images/bh-logo-en.svg";
import shareIcon from "../../assets/images/Share.svg";

export interface FamilyTreeThankYouPageProps extends WithTranslation {}

export interface FamilyTreeThankYouPageState {
  isSharingSupported: boolean;
}

class FamilyTreeThankYouPageComponent extends React.Component<
  FamilyTreeThankYouPageProps,
  FamilyTreeThankYouPageState
> {
  private readonly shareLinkButton: React.RefObject<any>;

  constructor(props: Readonly<FamilyTreeThankYouPageProps>) {
    super(props);
    this.shareLinkButton = React.createRef();

    this.state = {
      isSharingSupported: !!navigator.share
    }
  }

  componentDidMount(): void {
    if (this.shareLinkButton.current) {
      new ClipboardJS(this.shareLinkButton.current);
    }
  }

  render() {
    const t = this.props.t;
    const shareUrl = `https://bh-project.herokuapp.com${i18n.language === "he" ? "" : "/en"}`
    return (
      <div className="family-tree-thanks-page-container">
        <Header title={t("familyTreeThankYouPage.header", "העץ שלך נשמר")} />
        <div className="family-tree-thanks-body">
          <div className="text-first-part">
            <Trans i18nKey={"familyTreeThankYouPage.thankYouMessage"}><p>תודה רבה!</p></Trans>
            <Trans i18nKey={"familyTreeThankYouPage.thankYouMessage2"}><p>העץ נשמר במאגר עצי המשפחה המאובטח של מוזיאון העם היהודי. ברגעים אלו נשלח אליכם קובץ מייל עם הפרטים.</p></Trans>
            <p>
              <Trans i18nKey={"familyTreeThankYouPage.thankYouMessage3"}>אתם מוזמנים לבקר במוזיאון העם היהודי בבית התפוצות ולהמשיך ללמוד, </Trans>
              <Trans i18nKey={"familyTreeThankYouPage.thankYouMessage4"}>לחקור ולהיות חלק מהסיפור.</Trans>
            </p>
            <div className={"share-link-container"}>
                <Trans i18nKey={"familyTreeThankYouPage.linkSharingOptionsMessage"}>רוצה לשתף:</Trans>
              {this.state.isSharingSupported
              ? <a href={"#"}
                onClick={(event) => {
                  event.preventDefault();
                  navigator.share!({
                    title: t("familyTreeThankYouPage.linkShareSentTitle", "אפליקציה לבניית עצי משפחה של מוזיאון העם היהודי"),
                    text: t("familyTreeThankYouPage.linkShareSentContent","אפליקציה לבניית עצי משפחה של מוזיאון העם היהודי"),
                    url: "https://bh-project.herokuapp.com",
                  })
                    .catch((error) => console.log('Error sharing', error));
                }}>
                  <img className={"share-link"} src={shareIcon} alt={"share icon"}/>
                </a>
              : <>
                  <FacebookShareButton
                    hashtag={"#bhfamilytrees"}
                    quote={t("familyTreeThankYouPage.facebookLinkShareMessage", "אפליקציה לבניית עצי משפחה של מוזיאון העם היהודי")}
                    translate={undefined} url={shareUrl}>
                    <FacebookIcon path={undefined} crossOrigin={undefined} round={true} size={30}/>
                  </FacebookShareButton>
                  <EmailShareButton
                    subject={t("familyTreeThankYouPage.emailLinkShareMessage", "אפליקציה לבניית עצי משפחה של מוזיאון העם היהודי")}
                    translate={undefined} url={shareUrl}>
                    <EmailIcon round={true} size={31} crossOrigin={undefined} path={undefined}/>
                  </EmailShareButton>
                  <TelegramShareButton
                    title={t("familyTreeThankYouPage.telegramLinkShareMessage", "אפליקציה לבניית עצי משפחה של מוזיאון העם היהודי")}
                    translate={undefined} url={shareUrl}>
                    <TelegramIcon round={true} path={undefined} size={30} crossOrigin={undefined}/>
                  </TelegramShareButton>
                  <TwitterShareButton
                    title={t("familyTreeThankYouPage.twitterLinkShareMessage", "אפליקציה לבניית עצי משפחה של מוזיאון העם היהודי")}
                    translate={undefined} url={shareUrl}>
                    <TwitterIcon crossOrigin={undefined} path={undefined} size={30} round={true}/>
                  </TwitterShareButton>
                  <WhatsappShareButton
                    title={t("familyTreeThankYouPage.whats'upLinkShareMessage", "אפליקציה לבניית עצי משפחה של מוזיאון העם היהודי")}
                    translate={undefined} url={shareUrl}>
                    <WhatsappIcon  round={true} size={30} path={undefined} crossOrigin={undefined}/>
                  </WhatsappShareButton>
                </>}
            </div>
          </div>
          <div className="page-content-container information">
            <div className="bh-logo-class">
              <img className="bh-logo" alt="Beit Hatfutzot Logo" src={i18n.language === "he" ? bhLogoHe : bhLogoEn} />
            </div>
            <div className="information-boxes-upper">
              <a
                className="upper-right-box information-box"
                href={i18n.language === "he" ? "https://www.bh.org.il/he/" : "https://www.bh.org.il/"}
              >
                <Trans i18nKey={"familyTreeThankYouPage.upperRightRectangleText"}>
                  <span>בואו</span>
                  <span className="highlight">לבקר</span> במוזיאון העם היהודי
                </Trans>
              </a>
              <a
                className="lower-left-box information-box"
                href={i18n.language === "he" ? "https://dbs.bh.org.il/he/" : "https://dbs.bh.org.il/"}
              >
                <Trans i18nKey={"familyTreeThankYouPage.upperLeftRectangleText"}>
                  <span>בואו</span>
                  <span className="highlight"> לגלות </span> את העולם היהודי
                במאגרי המידע
                </Trans>
              </a>
            </div>
            <div className="information-boxes-lower">
              <a
                className="lower-right-box information-box"
                href={i18n.language === "he" ? "https://www.bh.org.il/he/%d7%97%d7%99%d7%a0%d7%95%d7%9a-%d7%93%d7%a3-%d7%91%d7%99%d7%aa/" : "https://www.bh.org.il/education-homepage/"}
              >
                <Trans i18nKey={"familyTreeThankYouPage.lowerRightRectangleText"}>
                  <span>בואו</span>
                <span className="highlight"> ללמוד </span> עם התוכניות
                החינוכיות
                </Trans>
              </a>
              <a
                className="upper-left-box information-box"
                href={i18n.language === "he" ? "https://www.bh.org.il/he/shop/" : "https://www.bh.org.il/shop/"}
              >
                <Trans i18nKey={"familyTreeThankYouPage.lowerLeftRectangleText"}>
                  <span>בואו</span>
                <span className={"highlight"}>לקנות</span> ממבחר הפריטים בחנות המוזיאון
                </Trans>
              </a>
            </div>
            <div className="information-bar-body">
              <div className="information-bar">
                <div className="line-style">
                  <Trans i18nKey={"familyTreeThankYouPage.thankYouInformationHeader"}>אודות מאגר עצי המשפחה במוזיאון</Trans>
                </div>
                <div className="text-line1">
                  <Trans i18nKey={"familyTreeThankYouPage.thankYouInformationText"}>
                  מעל ל-5 מיליוני בני אדם כבר רשומים במרכז לגנאלוגיה יהודית במוזיאון העם היהודי, והמאגר גדל מדי יום ומדי שעה. מבקרים ממגוון מקומות
                  ואורחות חיים באים להתחקות אחר שורשיהם, לתעד ולהנציח את אילן
                  משפחתם עבור הדורות הבאים, ובכך הם מוסיפים עוד ענף לאילן
                  המשפחתי הגדול של העם היהודי.
                  </Trans>
                </div>
              </div>
              <div className="information-bar">
                <div className="line-style">
                  <Trans i18nKey={"familyTreeThankYouPage.thankYouInformationHeader2"}>אודות מאגרי המידע של המוזיאון</Trans>
                </div>
                <div className="text-line2">
                  <Trans i18nKey={"familyTreeThankYouPage.thankYouInformationText2"}>
                  במוזיאון העם היהודי בבית התפוצות מאגרי מידע מגוונים ועשירים.
                  אילנות יוחסין (עצי משפחה), פירושים לשמות משפחה, תולדותיהן של
                  קהילות ברחבי העולם, צילומים, תמונות וסרטים, קטעי מוזיקה, מידע
                  על מושגים ואישים – כל החומרים נמצאים באתר אחד, עם חיפוש שמאגם
                  את סוגי התוכן וגם מקשר ביניהם בקישורים פנימיים.
                  </Trans>
                </div>
              </div>
              <div className="information-bar">
                <div className="line-style">
                  <Trans i18nKey={"familyTreeThankYouPage.thankYouInformationHeader3"}>
                  אודות מוזיאון העם היהודי
                  </Trans>
                </div>
                <div className="text-line3">
                  <Trans i18nKey={"familyTreeThankYouPage.thankYouInformationText3"}>
                  מוזיאון העם היהודי בבית התפוצות הוא מוסד עולמי שמספר על תרבות
                  אחת רבת-פנים, עשירה ועתירת רבדים; הוא מספר על אנשים ונשים, על
                  מבוגרים וילדים, על משפחות וקהילות, על השנה העברית ומועדיה, על
                  תלאות ושמחות, ועל פירות הרוח, החינוך והיצירה, המסורות ואורחות
                  החיים של העם היהודי, אשר נוצרו במגוון ארצות, בכל מיני תקופות,
                  תחת שליטים ומשטרים שונים, ובשבעים לשונות, במשך אלפי שנים.
                  במוזיאון העם היהודי מתואר העם היהודי, עם בקרב עמים אחרים, אשר
                  שומר ומטפח גם קשר מיוחד אל ארץ ישראל ואל מדינת ישראל.
                  </Trans>
                </div>
              </div>
              <div className="information-bar">
                <div className="line-style">
                  <Trans i18nKey={"familyTreeThankYouPage.thankYouInformationHeader4"}>
                  אודות פרויקט זה
                  </Trans>
                </div>
                <div className="text-line4">
                  <Trans i18nKey={"familyTreeThankYouPage.thankYouInformationText4"}>
                    <span>
                      פרויקט עצי המשפחה הוקם ע"מ לאפשר את הגדלת מאגר עצי המשפחה של
                      העם היהודי ומתוך מטרה להנגיש את איסוף פרטי המשפחה בצורה נוחה
                      וידידותית למשתמשים דרך הטלפון הנייד. הפרויקט נעשה בשיתוף עם
                      ארגון
                    </span>
                    <a href={i18n.language === "he" ? "https://she-codes.org/he/home-heb/" : "https://she-codes.org/"} target={"_blank"}> ;she codes </a>
                    <span>
                      ששם לו למטרה לקדם נשים במגזר ההייטק, ונוהל
                      ע"י מחלקת הדיגיטל של מוזיאון העם היהודי בבית התפוצות.
                    </span>
                  </Trans>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const FamilyTreeThankYouPage = withTranslation()(FamilyTreeThankYouPageComponent);
export { FamilyTreeThankYouPage };
