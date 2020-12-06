import axios from "axios";
import { History } from "history";
import * as React from "react";
import { withRouter } from "react-router-dom";
import { toast } from "react-toastify";
import {Trans, WithTranslation, withTranslation} from 'react-i18next';
import { i18n } from "../../i18n";
import config from "../../config";
import { Header } from "../header/header";
import { Loader } from "../loader/loader";

import "./familyTreePageSubmit.css";
import {FamilyTreeApiRequest} from "../../contracts/familyTreeApiRequest";
import {AppConfig} from "../../contracts/appConfig";
import {withAppConfig} from "../hoc/withAppConfig";
import {loadOrCreateTree} from "../../familyTreeService";
import {appConfigContext} from "../../context/appConfigContext";


export interface FamilyTreePageSubmitProps extends WithTranslation {
  history?: History;
  config: AppConfig;
}

export interface FamilyTreePageSubmitState {
  httpRequestInProgress: boolean;
}

class FamilyTreePageSubmitComponent extends React.Component<
  FamilyTreePageSubmitProps,
  FamilyTreePageSubmitState
> {
  state = {
    httpRequestInProgress: false
  };

  clearStoredFamilyTreeData() {
    localStorage.clear();
  }

  returnButtonHandler() {
    this.props.history!.push(`/family-tree/me`);
  }

  submitButtonHandler() {
    if (this.state.httpRequestInProgress) {
      return;
    }

    const familyTree = loadOrCreateTree();

    this.setState({ httpRequestInProgress: true });
    axios
      .post(`${config.apiBaseUrl}/api/family-tree/`, familyTree)
      .then(() => {
        this.clearStoredFamilyTreeData();
        this.props.history!.push("/thank-you");
      })
      .catch(error => {
        toast.error("השליחה נכשלה, נא צור קשר עם בית התפוצות");
        return Promise.reject(error);
      })
      .finally(() => {
        this.setState({ httpRequestInProgress: false });
      });
  }

  render() {
    const t = this.props.t;
    return (
      <div className="family-tree-submit-container">
        {this.state.httpRequestInProgress && <Loader />}
        <Header title={t("familyTreePageSubmit.header", "סיימת את בניית עץ המשפחה שלך")} />
        <div className="family-tree-submit-body page-content-container">
          <div className="pre-submittion-text">
            <Trans i18nKey={"familyTreePageSubmit.familyTreePreSubmissionMessage"}>זהו סיימת את בניית העץ, רוצה לעבור על הפרטים שמילאת, ולבדוק שאין </Trans>
            <Trans i18nKey={"familyTreePageSubmit.familyTreePreSubmissionMessage2"}>שגיאה?</Trans>
          </div>
          <div className="choose-option">
            <button
              onClick={this.returnButtonHandler.bind(this)}
              className="option-yes option-button"
            >
              <Trans i18nKey={"familyTreePageSubmit.familyTreeReturnFormButton"}>חזרה</Trans>
            </button>
            <button
              disabled={this.state.httpRequestInProgress}
              onClick={this.submitButtonHandler.bind(this)}
              className="option-no option-button"
            >
              <Trans i18nKey={"familyTreePageSubmit.familyTreeSendFormButton"}>שליחה</Trans>
            </button>
          </div>
        </div>
      </div>
    );
  }
}

const FamilyTreePageSubmit =
  withAppConfig(
    withTranslation()(
      withRouter(
        FamilyTreePageSubmitComponent as any
) as any as React.ComponentClass<FamilyTreePageSubmitProps>));
export { FamilyTreePageSubmit };
