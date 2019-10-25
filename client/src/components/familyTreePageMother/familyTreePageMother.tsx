import * as React from "react";
import { Header } from "../header/header";
import {
  PersonDetailsForm,
  PersonDetailsFormState
} from "../personDetailsForm/personDetailsForm";
import { ProceedButton } from "../proceedButton/proceedButton";

export interface FamilyTreePageMotherProps {}

export interface FamilyTreePageMotherState {
  motherDetails?: PersonDetailsFormState;
  motherOfMotherDetails?: PersonDetailsFormState;
  fatherOfMotherDetails?: PersonDetailsFormState;
  motherFormValid: boolean;
  motherOfMotherFormValid: boolean;
  fatherOfMotherFormValid: boolean;
}

class FamilyTreePageMother extends React.Component<
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
  }

  formChangeHandler(formName: string, state: PersonDetailsFormState) {
    localStorage.setItem(formName, JSON.stringify(state));
  }

  render() {
    return (
      <div className="family-tree-container">
        <Header title="הצד של אמא  2/4" />
        <div className="progress-scale">
          <div className="level active">1</div>
          <div className="level active">2</div>
          <div className="level">3</div>
          <div className="level">4</div>
        </div>
        <div className="family-tree-body">
          <PersonDetailsForm
            idPrefix="mother"
            title="אמא"
            displayIsAlive
            displayMaidenName
            defaults={this.state.motherDetails}
            onFormChange={(state: PersonDetailsFormState) => {
              this.formChangeHandler("motherDetails", state);
            }}
            onFormValidityChange={(isValid: boolean) => {
              this.setState({ motherFormValid: isValid });
            }}
          />
          <PersonDetailsForm
            idPrefix="mother-of-mother"
            title="אמא של אמא"
            displayIsAlive
            displayMaidenName
            defaults={this.state.motherOfMotherDetails}
            onFormChange={(state: PersonDetailsFormState) => {
              this.formChangeHandler("motherOfMotherDetails", state);
            }}
            onFormValidityChange={(isValid: boolean) => {
              this.setState({ motherOfMotherFormValid: isValid });
            }}
          />
          <PersonDetailsForm
            idPrefix="father-of-mother"
            title="אבא של אמא"
            displayIsAlive
            displayMaidenName
            defaults={this.state.fatherOfMotherDetails}
            onFormChange={(state: PersonDetailsFormState) => {
              this.formChangeHandler("fatherOfMotherDetails", state);
            }}
            onFormValidityChange={(isValid: boolean) => {
              this.setState({ fatherOfMotherFormValid: isValid });
            }}
          />
        </div>
        <div className="family-tree-footer">
          <ProceedButton
            disabled={
              !this.state.motherFormValid ||
              !this.state.motherOfMotherFormValid ||
              !this.state.fatherOfMotherFormValid
            }
            text="המשיכו"
            nextPageUrl="/family-tree/father"
          />
        </div>
      </div>
    );
  }
}

export { FamilyTreePageMother };
