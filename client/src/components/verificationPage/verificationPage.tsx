import * as React from "react";
import { ProceedButton } from "../proceedButton/proceedButton";
import { Header } from "../header/header";
import "./verificationPage.css";
import axios from "axios";
import { withRouter, match } from "react-router-dom";
import { TextInput } from "../textInput/textInput";

export interface VerificationPageProps {
  match?: match<{ email: string }>;
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

    let apiResponsePromise = axios
      .post(
        `https://she-codes-bh-project.herokuapp.com/auth/verification-code/${decodeURIComponent(
          this.props.match!.params.email
        )}`,
        { verificationCode: this.state.verificationCode }
      )
      .finally(() => {
        this.setState({ httpRequestInProgress: false });
      });

    return apiResponsePromise;
  }

  render() {
    return (
      <div className="verification-page-container">
        <Header title="אימות דואר אלקטרוני" />
        <div className="verification-body">
          <div className="verification-message">
            <div className="verification-message1">
              בדקו את תיבת הדואר. בדקות הקרובות תתקבל הודעה
            </div>
            <div className="verification-message2">
              ובה קוד אימות, יש להעתיק את הקוד לכאן:
            </div>
          </div>
          <div className="verification-form">
            <form>
              <TextInput
                id="code"
                type="text"
                placeholder="הזינו קוד"
                title="קוד אימות"
                onChange={event => {
                  this.setState({ verificationCode: event.target.value });
                }}
                className="verification-code-input"
              />
              <div className="verification-message3">
                במידה ולא התקבלה הודעה, בדקו את תיבת דואר הזבל
              </div>
              <ProceedButton
                disabled={
                  !this.validateForm() || this.state.httpRequestInProgress
                }
                text="אישור"
                nextPageUrl="/family-tree/me"
                callback={this.verifyCode.bind(this)}
              />
            </form>
          </div>
        </div>
      </div>
    );
  }
}

const VerificationPage = (withRouter(
  VerificationPageComponent as any
) as any) as React.ComponentClass<VerificationPageProps>;

export { VerificationPage };
