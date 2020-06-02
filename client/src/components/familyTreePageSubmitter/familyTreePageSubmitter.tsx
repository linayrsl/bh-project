import * as React from "react";
import "./familyTreePageSubmitter.scss";
import { Header } from "../header/header";
import {
  PersonDetailsForm,
  PersonDetailsFormState
} from "../personDetailsForm/personDetailsForm";
import { ProceedButton } from "../proceedButton/proceedButton";
import {Trans, WithTranslation, withTranslation} from 'react-i18next';

export interface FamilyTreePageSubmitterProps extends WithTranslation {}

export interface FamilyTreePageSubmitterState {
  submitterDetails?: PersonDetailsFormState;
  allFormsValid: boolean;
}

class FamilyTreePageSubmitterComponent extends React.Component<
  FamilyTreePageSubmitterProps,
  FamilyTreePageSubmitterState
> {
  constructor(props: FamilyTreePageSubmitterProps) {
    super(props);
    this.state = {
      allFormsValid: false
    };
  }

  componentDidMount() {
    let item = localStorage.getItem("submitterDetails");
    if (item) {
      let submitterDetails = JSON.parse(item);
      this.setState({ submitterDetails: submitterDetails });
    }
  }

  formChangeHandler(formName: string, state: PersonDetailsFormState) {
    localStorage.setItem(formName, JSON.stringify(state));
  }

  formValidityHandler(isValid: boolean) {
    this.setState({ allFormsValid: isValid });
  }

  render() {
    const t = this.props.t;
    return (
      <div className="family-tree-container">
        <Header title={t("familyTreePageSubmitter.header", "הפרטים שלי - 1/4")} />
        <div className="progress-scale">
          <div className="level active">1</div>
          <div className="level">2</div>
          <div className="level">3</div>
          <div className="level">4</div>
        </div>
        <div className="family-tree-body page-content-container ">
          <PersonDetailsForm
            isSubmitter={true}
            defaults={this.state.submitterDetails}
            onFormChange={(state: PersonDetailsFormState) => {
              this.formChangeHandler("submitterDetails", state);
            }}
            onFormValidityChange={this.formValidityHandler.bind(this)}
            idPrefix="me"
            title={t("familyTreePageSubmitter.familyTreeCurrentEntity", "אני")}
          />
          <div className={"mandatory-fields-message"}>
            <Trans i18nKey={"familyTreePageSubmitter.familyTreeMandatoryFieldsMessage"}>* שדות חובה למילוי</Trans>
          </div>
          <div className="vertical-spacer"></div>
          <div className="family-tree-footer">
            <ProceedButton
              disabled={!this.state.allFormsValid}
              text={t("familyTreePageSubmitter.familyTreeProceedButton", "המשיכו")}
              nextPageUrl="/family-tree/mother"
            />
          </div>
        </div>
      </div>
    );
  }
}

const FamilyTreePageSubmitter = withTranslation()(FamilyTreePageSubmitterComponent);
export { FamilyTreePageSubmitter };
