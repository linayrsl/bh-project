import axios from "axios";
import * as React from "react";
import { withRouter, match } from "react-router-dom";
import { toast } from "react-toastify";
import {Trans, WithTranslation, withTranslation} from 'react-i18next';

import { ProceedButton } from "../proceedButton/proceedButton";
import { Header } from "../header/header";
import { TextInput } from "../textInput/textInput";
import { Loader } from "../loader/loader";


import "./verificationPage.css";
import {AppConfig} from "../../contracts/appConfig";
import {withAppConfig} from "../hoc/withAppConfig";

export interface VerificationPageProps extends WithTranslation {
  match?: match<{ email: string }>;
  config: AppConfig;
}

export interface VerificationPageState {
  verificationCode: string;
  httpRequestInProgress: boolean;
}

class VerificationPageComponent extends React.Component<
  VerificationPageProps,
  VerificationPageState
> {
  state = {
    verificationCode: "",
    httpRequestInProgress: false
  };

  validateForm(): boolean {
    return this.state.verificationCode.length > 0;
  }

  verifyCode(): Promise<any> {
    this.setState({ httpRequestInProgress: true });

    const t = this.props.t;

    let apiResponsePromise = axios
      .post(
        `${this.props.config.apiBaseUrl}/api/auth/verification-code/${decodeURIComponent(
          this.props.match!.params.email
        )}`,
        { verificationCode: this.state.verificationCode }
      )
      .then((response) => {
        window.localStorage.setItem("submitterEmail", decodeURIComponent(this.props.match!.params.email));
        return response;
      })
      .catch(error => {
        if (error && error.response && error.response.status === 400) {
          toast.error(t("ToastNotifications.verificationNotification", "יש להזין קוד אימות בן 5 ספרות"));
        } else if (error && error.response && error.response.status === 401) {
          toast.error(t("ToastNotifications.verificationNotification2", "קוד אימות שגוי. נא נסה שוב."));
        } else if (error && error.response && error.response.status === 404) {
          toast.error(t("ToastNotifications.verificationNotification3", "קוד האימות לא קיים. נא נסה להירשם בשנית."));
        } else {
          toast.error(t("ToastNotifications.verificationNotification4", "לא הצלחנו לאמת פרטים אישיים. נא נסה להירשם מחדש."));
        }
        return Promise.reject(error);
      })
      .finally(() => {
        this.setState({ httpRequestInProgress: false });
      });

    return apiResponsePromise;
  }

  render() {
    const t = this.props.t;
    return (
      <div className="verification-page-container">
        {this.state.httpRequestInProgress && <Loader />}
        <Header title={t("verificationPage.header", "אימות דואר אלקטרוני")} />
        <div className="verification-body page-content-container ">
          <div className="verification-message">
            <div className="verification-message1">
             <Trans i18nKey={"verificationPage.verificationMessage"}> בדקו את תיבת הדואר
               <span>{{userEmail: decodeURIComponent(this.props.match!.params.email)}}</span>
               . בדקות הקרובות תתקבל הודעה</Trans>
            </div>
            <div className="verification-message2">
              <Trans i18nKey={"verificationPage.verificationMessage2"}>ובה קוד אימות, יש להעתיק את הקוד לכאן:</Trans>
            </div>
          </div>

          <div className="verification-form">
            <form>
              <TextInput
                id="code"
                type="text"
                placeholder={t("verificationPage.verificationCodePlaceholder", "הזינו קוד")}
                title={t("verificationPage.verificationCode", "קוד אימות")}
                onChange={event => {
                  this.setState({ verificationCode: event.target.value });
                }}
                className="verification-code-input"
              />
              <div className="verification-message3">
                <Trans i18nKey={"verificationPage.verificationCodeMessage"}>במידה ולא התקבלה הודעה, בדקו את תיבת דואר הזבל</Trans>
              </div>
            </form>
          </div>
          <div className="vertical-spacer"></div>
          <div className="verification-cta">
            <ProceedButton
              disabled={
                !this.validateForm() || this.state.httpRequestInProgress
              }
              text={t("verificationPage.verificationProceedButton", "אישור")}
              nextPageUrl="/family-tree/me"
              callback={this.verifyCode.bind(this)}
            />
          </div>
        </div>
      </div>
    );
  }
}

const VerificationPage =
  withAppConfig(
    withTranslation()(
      withRouter(
        VerificationPageComponent as any
      ) as any as React.ComponentClass<VerificationPageProps>));

export { VerificationPage };
