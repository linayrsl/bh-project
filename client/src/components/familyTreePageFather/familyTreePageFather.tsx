import * as React from "react";
import {
  PersonDetailsFormState,
  PersonDetailsForm
} from "../personDetailsForm/personDetailsForm";
import { Header } from "../header/header";
import { ProceedButton } from "../proceedButton/proceedButton";

export interface FamilyTreePageFatherProps {}

export interface FamilyTreePageFatherState {
  fatherDetails?: PersonDetailsFormState;
  motherOfFatherDetails?: PersonDetailsFormState;
  fatherOfFatherDetails?: PersonDetailsFormState;
  fatherFormValid: boolean;
  motherOfFatherFormValid: boolean;
  fatherOfFatherFormValid: boolean;
}

class FamilyTreePageFather extends React.Component<
  FamilyTreePageFatherProps,
  FamilyTreePageFatherState
> {
  constructor(props: FamilyTreePageFatherProps) {
    super(props);
    this.state = {
      fatherFormValid: false,
      motherOfFatherFormValid: false,
      fatherOfFatherFormValid: false
    };
  }

  componentDidMount() {
    let item = localStorage.getItem("fatherDetails");
    if (item) {
      let fatherDetails = JSON.parse(item);
      this.setState({ fatherDetails: fatherDetails });
    }
    item = localStorage.getItem("motherOfFatherDetails");
    if (item) {
      let motherOfFatherDetails = JSON.parse(item);
      this.setState({ motherOfFatherDetails: motherOfFatherDetails });
    }
    item = localStorage.getItem("fatherOfFatherDetails");
    if (item) {
      let fatherOfFatherDetails = JSON.parse(item);
      this.setState({ fatherOfFatherDetails: fatherOfFatherDetails });
    }
  }

  formChangeHandler(formName: string, state: PersonDetailsFormState) {
    localStorage.setItem(formName, JSON.stringify(state));
  }

  render() {
    return (
      <div className="family-tree-container">
        <Header title="הצד של אבא  3/4" />
        <div className="progress-scale">
          <div className="level active">1</div>
          <div className="level active">2</div>
          <div className="level active">3</div>
          <div className="level">4</div>
        </div>
        <div className="family-tree-body">
          <PersonDetailsForm
            idPrefix="father"
            title="אבא"
            displayIsAlive
            displayMaidenName
            defaults={this.state.fatherDetails}
            onFormChange={(state: PersonDetailsFormState) => {
              this.formChangeHandler("fatherDetails", state);
            }}
            onFormValidityChange={(isValid: boolean) => {
              this.setState({ fatherFormValid: isValid });
            }}
          />
          <PersonDetailsForm
            idPrefix="father-of-mother"
            title="אמא של אבא"
            displayIsAlive
            displayMaidenName
            defaults={this.state.motherOfFatherDetails}
            onFormChange={(state: PersonDetailsFormState) => {
              this.formChangeHandler("motherOfFatherDetails", state);
            }}
            onFormValidityChange={(isValid: boolean) => {
              this.setState({ motherOfFatherFormValid: isValid });
            }}
          />
          <PersonDetailsForm
            idPrefix="father-of-father"
            title="אבא של אבא"
            displayIsAlive
            displayMaidenName
            defaults={this.state.fatherOfFatherDetails}
            onFormChange={(state: PersonDetailsFormState) => {
              this.formChangeHandler("fatherOfFatherDetails", state);
            }}
            onFormValidityChange={(isValid: boolean) => {
              this.setState({ fatherOfFatherFormValid: isValid });
            }}
          />
        </div>
        <div className="family-tree-footer">
          <ProceedButton
            disabled={
              !this.state.fatherFormValid ||
              !this.state.motherOfFatherFormValid ||
              !this.state.fatherOfFatherFormValid
            }
            text="המשיכו"
            nextPageUrl="/family-tree/siblings"
          />
        </div>
      </div>
    );
  }
}

export { FamilyTreePageFather };
