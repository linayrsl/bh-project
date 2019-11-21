import * as React from "react";
import axios from "axios";
import { toast } from "react-toastify";

import "./registerPage.css";
import { ProceedButton } from "../proceedButton/proceedButton";
import { Header } from "../header/header";
import { TextInput } from "../textInput/textInput";
import { Loader } from "../loader/loader";

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
      this.state.disclaimer &&
      this.state.email.length > 0 &&
      this.state.phone.length > 0
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
