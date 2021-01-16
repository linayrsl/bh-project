import * as React from "react";
import { Component } from "react";
import {Trans, WithTranslation, withTranslation} from 'react-i18next';
import { i18n } from "../../i18n";
import bhLogoHe from "../../assets/images/new-logo-hebrew.svg";
import bhLogoEn from "../../assets/images/new-logo-english.svg";
import languageButton from "../../assets/images/lang-button.svg";
import "./homePage.scss";
import { ProceedButton } from "../proceedButton/proceedButton";

interface HomePageProps extends WithTranslation {}

class HomePageComponent extends Component<HomePageProps> {
  render() {
    const t = this.props.t;
    return (
      <div className="home-page-container">
        <div className="home-header">
          <img className="bh-logo" alt="Beit Hatfutzot Logo" src={i18n.language === "he" ? bhLogoHe : bhLogoEn} />
          <a aria-label={t("homePage.changeLanguage", "Go to English version")} className={"languageButton"} href={i18n.language === "he" ? "/en" : "/"}>
            <img aria-hidden alt={"choose language"} src={languageButton} />
          </a>
        </div>
        <div className="home-page-body">
          <div className="welcome-message" tabIndex={0}>
            <span className="part1"><Trans i18nKey={"homePage.welcomeMessage"}> ברוכים הבאים</Trans></span>
            <br />
            <span className="part2">
              <Trans i18nKey={"homePage.welcomeMessagePart2"}>
                <span>ל</span><span className="part2-inner">פרויקט עצי המשפחה</span>
              </Trans>
            </span>
            <br />
            <Trans i18nKey={"homePage.welcomeMessagePart3"}>
              של מוזיאון העם היהודי בבית התפוצות.
            </Trans>
          <br />
          <Trans i18nKey={"homePage.welcomeMessagePart4"}></Trans>
          </div>
          <div className="welcome-explanation" tabIndex={0}>
            <Trans i18nKey={"homePage.theProjectObjective"}>
              כאן תוכלו ליצור את עץ המשפחה שלכם
            </Trans>
            <br />
            <Trans i18nKey={"homePage.theProjectObjective2"}>ב-4 צעדים פשוטים.</Trans>
          </div>
          <div className="vertical-spacer"></div>
          <div className="welcome-disclaimer" tabIndex={0}>
            <Trans i18nKey={"homePage.projectDisclaimer"}>העץ שתבנו יישמר במאגר עצי המשפחה</Trans>
            <br />
            <Trans i18nKey={"homePage.projectDisclaimer2"}>המאובטח של מוזיאון העם היהודי ותוכלו לעיין בו</Trans>
            <br />
            <Trans i18nKey={"homePage.projectDisclaimer3"}>ולערוך אותו בעתיד באתר המוזיאון.</Trans>
          </div>
          <div className="welcome-cta">
            <ProceedButton text={t("homePage.proceedButton", "כניסה")} nextPageUrl="/register" tabIndex={0} />
          </div>
        </div>
      </div>
    );
  }
}

const HomePage = withTranslation()(HomePageComponent);
export { HomePage };
