import * as React from "react";
import axios from "axios";
import { toast } from "react-toastify";
import 'react-phone-number-input/style.css'
import PhoneInput, {isValidPhoneNumber} from 'react-phone-number-input'

import "./registerPage.css";
import { ProceedButton } from "../proceedButton/proceedButton";
import { Header } from "../header/header";
import { TextInput } from "../textInput/textInput";
import { Loader } from "../loader/loader";

export interface RegisterPageProps {}

export interface RegisterPageState {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  disclaimer: boolean;
  httpRequestInProgress: boolean;
}

class RegisterPage extends React.Component<
  RegisterPageProps,
  RegisterPageState
> {
  state = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    disclaimer: false,
    httpRequestInProgress: false
  };

  register(): Promise<any> {
    this.setState({ httpRequestInProgress: true });

    let apiResponsePromise = axios
      .post("/api/auth/register/", {
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        email: this.state.email,
        phone: this.state.phone
      })
      .catch(error => {
        if (error && error.response && error.response.status === 400) {
          toast.error("מספר סלולרי ו/או דואר אלקטרוני שגויים");
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
    return (
      <div className="register-page-container">
        {this.state.httpRequestInProgress && <Loader />}
        <Header title="הרשמה" />
        <div className="register-body page-content-container ">
          <div className="register-message">
            <div className="register-user">פרטי רישום</div>
          </div>
          <div className="register-form">
            <form>
              <TextInput
                id="firstName"
                type="text"
                title="שם פרטי"
                placeholder="הזינו שם פרטי"
                required={true}
                onChange={event => {
                  this.setState({firstName: event.target.value});
                }}
              >
              </TextInput>
              <TextInput
                id="lastName"
                type="text"
                title="שם משפחה"
                placeholder="הזינו שם משפחה"
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
                title="דואר אלקטרוני"
                placeholder="הזינו מייל"
                required={true}
                validationErrorMessage={"הפורמט של כתובת המייל אינו תקין"}
                onChange={event => {
                  this.setState({ email: event.target.value });
                }}
                className="ltr"
              />
              <div className={`phone-input-container ${
                this.state.phone && !isValidPhoneNumber(this.state.phone) ? 'invalid' : ''
              }`}>
                <label htmlFor="phone"><span className={"mandatory-field-indicator"}>*</span>טלפון סלולרי</label>
                <PhoneInput id="phone"
                  placeholder="הזינו מספר"
                  defaultCountry={'IL'}
                  value={''}
                  onChange={value => {
                    this.setState({ phone: value });
                  }}
                  error={this.state.phone ? (isValidPhoneNumber(this.state.phone) ? undefined : 'Invalid phone number') : 'Phone number required'}
                />
                {(this.state.phone && !isValidPhoneNumber(this.state.phone)) && <div className={"invalid-input-feedback"}>"מספר טלפון לא תקין"</div>}
              </div>
              <div className={"mandatory-fields-message"}>* שדות חובה למילוי</div>
              <div className="user-checkbox styled-checkbox ">
                <input
                  onChange={event => {
                    this.setState({disclaimer: event.target.checked});
                  }}
                  defaultChecked={this.state.disclaimer}
                  type="checkbox"
                  className="checkbox" />
                <span className="accept-conditions-full">
                  קראתי ואני מסכים/ה ל
                  <a
                    target="_blank"
                    href="https://www.bh.org.il/he/%d7%9e%d7%90%d7%92%d7%a8%d7%99%d7%9d-%d7%95%d7%90%d7%95%d7%a1%d7%a4%d7%99%d7%9d/%d7%92%d7%a0%d7%90%d7%9c%d7%95%d7%92%d7%99%d7%94-%d7%99%d7%94%d7%95%d7%93%d7%99%d7%aa/%d7%94%d7%a6%d7%94%d7%a8%d7%aa-%d7%95%d7%99%d7%aa%d7%95%d7%a8/"
                    className="accept-conditions"
                  >
                    תנאי השימוש
                  </a>
                </span>
              </div>
            </form>
          </div>
          <div className="vertical-spacer"></div>
          <div className="register-disclaimer">
            לא לדאוג, לא נשלח הודעות ספאם!
          </div>
          <div className=""></div>
          <div className="register-cta">
            <ProceedButton
              disabled={
                !this.validateForm() || this.state.httpRequestInProgress
              }
              text="המשיכו"
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

export { RegisterPage };
