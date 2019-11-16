import * as React from "react";
import axios from "axios";

import "./registerPage.css";
import { ProceedButton } from "../proceedButton/proceedButton";
import { Header } from "../header/header";
import { TextInput } from "../textInput/textInput";

export interface RegisterPageProps {}

export interface RegisterPageState {
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
    email: "",
    phone: "",
    disclaimer: false,
    httpRequestInProgress: false
  };

  register(): Promise<any> {
    this.setState({ httpRequestInProgress: true });

    let apiResponsePromise = axios
      .post("/api/auth/register/", {
        email: this.state.email,
        phone: this.state.phone
      })
      .finally(() => {
        this.setState({ httpRequestInProgress: false });
      });

    return apiResponsePromise;
  }

  validateForm(): boolean {
    return (
      this.state.disclaimer &&
      this.state.email.length > 0 &&
      this.state.phone.length > 0
    );
  }

  render() {
    return (
      <div className="register-page-container">
        <Header title="הרשמה" />
        <div className="register-body page-content-container ">
          <div className="register-message">
            <div className="register-user">פרטי רישום</div>
          </div>
          <div className="register-form">
            <form>
              <TextInput
                validateRegex={/[^@]+@[^@]+/}
                id="email"
                type="email"
                title="דואר אלקטרוני"
                placeholder="הזינו מייל"
                onChange={event => {
                  this.setState({ email: event.target.value });
                }}
                className="ltr"
              />
              <TextInput
                id="phone"
                type="phone"
                title="טלפון סלולרי"
                placeholder="הזינו מספר"
                onChange={event => {
                  this.setState({ phone: event.target.value });
                }}
                className="ltr"
              />
              <div className="user-checkbox styled-checkbox ">
                <input
                  onChange={event => {
                    this.setState({ disclaimer: event.target.checked });
                  }}
                  defaultChecked={this.state.disclaimer}
                  type="checkbox"
                  className="checkbox"
                ></input>
                <span className="accept-conditions-full">
                  קראתי ואני מסכים/ה ל
                  <span className="accept-conditions">תנאי השימוש</span>
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
