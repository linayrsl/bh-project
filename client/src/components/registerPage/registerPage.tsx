import * as React from "react";
import axios from "axios";
import { toast } from "react-toastify";
import 'react-phone-number-input/style.css'
import PhoneInput, {isValidPhoneNumber} from 'react-phone-number-input'
import {Trans, WithTranslation, withTranslation} from 'react-i18next';
import { ProceedButton } from "../proceedButton/proceedButton";
import { Header } from "../header/header";
import { TextInput } from "../textInput/textInput";
import { Loader } from "../loader/loader";
import { i18n } from "../../i18n";
import {AppConfig} from "../../contracts/appConfig";

import "./registerPage.css";
import {withAppConfig} from "../hoc/withAppConfig";

export interface RegisterPageProps extends WithTranslation {
  config: AppConfig;
}

export interface RegisterPageState {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  disclaimer: boolean;
  httpRequestInProgress: boolean;
  isPhoneValid: boolean;
  wasPhoneInvalidBefore: boolean;
}

class RegisterPageComponent extends React.Component<
  RegisterPageProps,
  RegisterPageState
> {
  state = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    disclaimer: false,
    httpRequestInProgress: false,
    isPhoneValid: true,
    wasPhoneInvalidBefore: false
  };

  register(): Promise<any> {
    this.setState({ httpRequestInProgress: true });

    const t = this.props.t;

    let apiResponsePromise = axios
      .post(`${this.props.config.apiBaseUrl}/api/auth/register/`, {
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        email: this.state.email,
        phone: this.state.phone,
        language: i18n.language
      })
      .catch(error => {
        if (error && error.response && error.response.status === 400) {
          toast.error(t("ToastNotifications.registerNotification", "מספר סלולרי ו/או דואר אלקטרוני שגויים"));
        } else {
          toast.error("לא הצלחנו לשלוח קוד אימות. נא נסה שוב מאוחר יותר");
        }
        return Promise.reject(error);
      })
      .finally(() => {
        this.setState({ httpRequestInProgress: false });
      });

    return apiResponsePromise;
  }

  validateForm(): boolean {
    return (
      this.state.firstName.length > 0 &&
      this.state.lastName.length > 0 &&
      this.state.disclaimer &&
      this.state.email.length > 0 &&
      isValidPhoneNumber(this.state.phone)
    );
  }

  render() {
    const t = this.props.t;
    return (
      <div className="register-page-container">
        {this.state.httpRequestInProgress && <Loader />}
        <Header title={t("registerPage.header", "הרשמה")} />
        <div className="register-body page-content-container ">
          <div className="register-message">
            <div className="register-user">
              <Trans i18nKey={"registerPage.registerDetails"}>פרטי רישום</Trans>
            </div>
          </div>
          <div className="register-form">
            <form>
              <TextInput
                id="firstName"
                type="text"
                title={t("registerPage.registerFormName", "שם פרטי")}
                placeholder={t("registerPage.registerFormNamePlaceholder", "הזינו שם פרטי")}
                required={true}
                onChange={event => {
                  this.setState({firstName: event.target.value});
                }}
              >
              </TextInput>
              <TextInput
                id="lastName"
                type="text"
                title={t("registerPage.registerFormLastName", "שם משפחה")}
                placeholder={t("registerPage.registerFormLastNamePlaceholder", "הזינו שם משפחה")}
                required={true}
                onChange={event => {
                  this.setState({lastName: event.target.value});
                }}
              >
              </TextInput>
              <TextInput
                validateRegex={/[^@]+@[^@]+/}
                id="email"
                type="email"
                title={t("registerPage.registerFormEmail", "דואר אלקטרוני")}
                placeholder={t("registerPage.registerFormEmailPlaceholder", "הזינו מייל")}
                required={true}
                validationErrorMessage={t("registerPage.registerFormEmailErrorMessage", "הפורמט של כתובת המייל אינו תקין")}
                onChange={event => {
                  this.setState({ email: event.target.value });
                }}
                className="ltr"
              />
              <div
                onBlur={(event) => {
                  if (event.target.id === "phone") {
                    if (isValidPhoneNumber(this.state.phone)) {
                      this.setState({isPhoneValid: true});
                    } else {
                      this.setState({isPhoneValid: false, wasPhoneInvalidBefore: true});
                    }
                  }
                }}
                className={`phone-input-container ${
                this.state.phone && !this.state.isPhoneValid ? "invalid" : ''
              }`}>
                <label htmlFor="phone"><span className={"mandatory-field-indicator"}>*</span>
                  <Trans i18nKey={"registerPage.registerFormPhone"}>טלפון סלולרי</Trans>
                </label>
                <PhoneInput
                  id="phone"
                  // @ts-ignore
                  countrySelectProps={{ unicodeFlags: true }}
                  placeholder={t("registerPage.registerFormPhonePlaceholder", "הזינו מספר")}
                  defaultCountry={'IL'}
                  value={''}
                  onChange={value => {
                    if (this.state.wasPhoneInvalidBefore) {
                      this.setState({isPhoneValid: isValidPhoneNumber(value)});
                    }
                    this.setState({ phone: value });
                  }}
                  error={this.state.phone ? (this.state.isPhoneValid ? undefined : 'Invalid phone number') : 'Phone number required'}
                />
                {(this.state.phone && !this.state.isPhoneValid) && <div className={"invalid-input-feedback"}>
                  <Trans i18nKey={"registerPage.registerFormPhoneErrorMessage"}>מספר טלפון לא תקין</Trans>
                </div>}
              </div>
              <div className={"mandatory-fields-message"}>
                <Trans i18nKey={"registerPage.registerFormMandatoryFieldsMessage"}>* שדות חובה למילוי</Trans>
              </div>
              <div className="user-checkbox styled-checkbox ">
                <input
                  onChange={event => {
                    this.setState({disclaimer: event.target.checked});
                  }}
                  defaultChecked={this.state.disclaimer}
                  type="checkbox"
                  className="checkbox" />
                <span className="accept-conditions-full">
                  <Trans i18nKey={"registerPage.registerFormAcceptConditions"}>קראתי ואני מסכים/ה ל</Trans>
                  <a
                    target="_blank"
                    href={i18n.language === "he" ? "https://www.bh.org.il/he/%d7%9e%d7%90%d7%92%d7%a8%d7%99%d7%9d-%d7%95%d7%90%d7%95%d7%a1%d7%a4%d7%99%d7%9d/%d7%92%d7%a0%d7%90%d7%9c%d7%95%d7%92%d7%99%d7%94-%d7%99%d7%94%d7%95%d7%93%d7%99%d7%aa/%d7%94%d7%a6%d7%94%d7%a8%d7%aa-%d7%95%d7%99%d7%aa%d7%95%d7%a8/" : "https://www.bh.org.il/databases/jewish-genealogy/declaration/"}
                    className="accept-conditions"
                  >
                    <Trans i18nKey={"registerPage.registerUseConditionsLink"}>תנאי השימוש</Trans>
                  </a>
                </span>
              </div>
            </form>
          </div>
          <div className="vertical-spacer"></div>
          <div className="register-disclaimer">
            <Trans i18nKey={"registerPage.registerDisclaimer"}>לא לדאוג, לא נשלח הודעות ספאם!</Trans>
          </div>
          <div className=""></div>
          <div className="register-cta">
            <ProceedButton
              disabled={
                !this.validateForm() || this.state.httpRequestInProgress
              }
              text={t("registerPage.registerProceedButton", "המשיכו")}
              nextPageUrl={`/verification/${encodeURIComponent(
                this.state.email
              )}`}
              callback={this.register.bind(this)}
            />
          </div>
        </div>
      </div>
    );
  }
}

const withTranslationHoc = withTranslation();
const RegisterPage =
  withAppConfig(
    withTranslationHoc(
      RegisterPageComponent));

export { RegisterPage };
