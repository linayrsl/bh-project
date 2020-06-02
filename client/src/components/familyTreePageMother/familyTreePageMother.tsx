import * as React from "react";
import { Header } from "../header/header";
import {
  PersonDetailsForm,
  PersonDetailsFormState
} from "../personDetailsForm/personDetailsForm";
import {Trans, WithTranslation, withTranslation} from 'react-i18next';
import { ProceedButton } from "../proceedButton/proceedButton";

export interface FamilyTreePageMotherProps  extends WithTranslation {}

export interface FamilyTreePageMotherState {
  motherDetails?: PersonDetailsFormState;
  motherOfMotherDetails?: PersonDetailsFormState;
  fatherOfMotherDetails?: PersonDetailsFormState;
  motherFormValid: boolean;
  motherOfMotherFormValid: boolean;
  fatherOfMotherFormValid: boolean;
}

class FamilyTreePageMotherComponent extends React.Component<
  FamilyTreePageMotherProps,
  FamilyTreePageMotherState
> {
  constructor(props: FamilyTreePageMotherProps) {
    super(props);
    this.state = {
      motherFormValid: false,
      motherOfMotherFormValid: false,
      fatherOfMotherFormValid: false
    };
  }

  componentDidMount() {
    let item = localStorage.getItem("motherDetails");
    if (item) {
      let motherDetails = JSON.parse(item);
      this.setState({ motherDetails: motherDetails });
    }
    item = localStorage.getItem("motherOfMotherDetails");
    if (item) {
      let motherOfMotherDetails = JSON.parse(item);
      this.setState({ motherOfMotherDetails: motherOfMotherDetails });
    }
    item = localStorage.getItem("fatherOfMotherDetails");
    if (item) {
      let fatherOfMotherDetails = JSON.parse(item);
      this.setState({ fatherOfMotherDetails: fatherOfMotherDetails });
    }

    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  formChangeHandler(formName: string, state: PersonDetailsFormState) {
    localStorage.setItem(formName, JSON.stringify(state));
  }

  render() {
    const t = this.props.t;
    return (
      <div className="family-tree-container">
        <Header title={t("familyTreePageMother.header", "הצד של אמא  2/4")} />
        <div className="progress-scale">
          <div className="level active">1</div>
          <div className="level active">2</div>
          <div className="level">3</div>
          <div className="level">4</div>
        </div>
        <div className="family-tree-body page-content-container ">
          <PersonDetailsForm
            idPrefix="mother"
            title={t("familyTreePageMother.familyTreeCurrentEntity", "אמא")}
            displayIsAlive
            displayMaidenName
            defaults={this.state.motherDetails}
            defaultGender="female"
            onFormChange={(state: PersonDetailsFormState) => {
              this.formChangeHandler("motherDetails", state);
            }}
            onFormValidityChange={(isValid: boolean) => {
              this.setState({ motherFormValid: isValid });
            }}
          />
          <PersonDetailsForm
            idPrefix="mother-of-mother"
            title={t("familyTreePageMother.familyTreeMothersMother", "אמא של אמא")}
            displayIsAlive
            displayMaidenName
            defaults={this.state.motherOfMotherDetails}
            defaultGender={"female"}
            onFormChange={(state: PersonDetailsFormState) => {
              this.formChangeHandler("motherOfMotherDetails", state);
            }}
            onFormValidityChange={(isValid: boolean) => {
              this.setState({ motherOfMotherFormValid: isValid });
            }}
          />
          <PersonDetailsForm
            idPrefix="father-of-mother"
            title={t("familyTreePageMother.familyTreeMothersFather", "אבא של אמא")}
            displayIsAlive
            displayMaidenName
            defaults={this.state.fatherOfMotherDetails}
            defaultGender={"male"}
            onFormChange={(state: PersonDetailsFormState) => {
              this.formChangeHandler("fatherOfMotherDetails", state);
            }}
            onFormValidityChange={(isValid: boolean) => {
              this.setState({ fatherOfMotherFormValid: isValid });
            }}
          />
          <div className="family-tree-footer">
            <ProceedButton
              disabled={
                !this.state.motherFormValid ||
                !this.state.motherOfMotherFormValid ||
                !this.state.fatherOfMotherFormValid
              }
              text={t("familyTreePageMother.familyTreeProceedButton", "המשיכו")}
              nextPageUrl="/family-tree/father"
            />
          </div>
        </div>
      </div>
    );
  }
}

const FamilyTreePageMother = withTranslation()(FamilyTreePageMotherComponent);
export { FamilyTreePageMother };
