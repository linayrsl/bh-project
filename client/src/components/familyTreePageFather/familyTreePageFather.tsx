import * as React from "react";
import {
  PersonDetailsFormState,
  PersonDetailsForm
} from "../personDetailsForm/personDetailsForm";
import { Header } from "../header/header";
import { ProceedButton } from "../proceedButton/proceedButton";
import {Trans, WithTranslation, withTranslation} from 'react-i18next';

export interface FamilyTreePageFatherProps extends WithTranslation {}

export interface FamilyTreePageFatherState {
  fatherDetails?: PersonDetailsFormState;
  motherOfFatherDetails?: PersonDetailsFormState;
  fatherOfFatherDetails?: PersonDetailsFormState;
  fatherFormValid: boolean;
  motherOfFatherFormValid: boolean;
  fatherOfFatherFormValid: boolean;
}

class FamilyTreePageFatherComponent extends React.Component<
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
        <Header title={t("familyTreePageFather.header", "הצד של אבא  3/4")} />
        <div className="progress-scale">
          <div className="level active">1</div>
          <div className="level active">2</div>
          <div className="level active">3</div>
          <div className="level">4</div>
        </div>
        <div className="family-tree-body page-content-container ">
          <PersonDetailsForm
            idPrefix="father"
            title={t("familyTreePageFather.familyTreeCurrentEntity", "אבא")}
            displayIsAlive
            displayMaidenName
            defaults={this.state.fatherDetails}
            defaultGender={"male"}
            onFormChange={(state: PersonDetailsFormState) => {
              this.formChangeHandler("fatherDetails", state);
            }}
            onFormValidityChange={(isValid: boolean) => {
              this.setState({ fatherFormValid: isValid });
            }}
          />
          <PersonDetailsForm
            idPrefix="father-of-mother"
            title={t("familyTreePageFather.familyTreeFathersMother", "אמא של אבא")}
            displayIsAlive
            displayMaidenName
            defaults={this.state.motherOfFatherDetails}
            defaultGender={"female"}
            onFormChange={(state: PersonDetailsFormState) => {
              this.formChangeHandler("motherOfFatherDetails", state);
            }}
            onFormValidityChange={(isValid: boolean) => {
              this.setState({ motherOfFatherFormValid: isValid });
            }}
          />
          <PersonDetailsForm
            idPrefix="father-of-father"
            title={t("familyTreePageFather.familyTreeFathersFather", "אבא של אבא")}
            displayIsAlive
            displayMaidenName
            defaults={this.state.fatherOfFatherDetails}
            defaultGender={"male"}
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
            text={t("familyTreePageFather.familyTreeProceedButton", "המשיכו")}
            nextPageUrl="/family-tree/siblings"
          />
        </div>
      </div>
    );
  }
}

const FamilyTreePageFather = withTranslation()(FamilyTreePageFatherComponent);
export { FamilyTreePageFather };
