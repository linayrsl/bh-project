import * as React from "react";
import { Header } from "../header/header";
import {
  PersonDetailsForm,
  PersonDetailsFormState
} from "../personDetailsForm/personDetailsForm";
import {Trans, WithTranslation, withTranslation} from 'react-i18next';
import { ProceedButton } from "../proceedButton/proceedButton";
import {loadOrCreateTree, saveTree} from "../../familyTreeService";
import {FamilyTree} from "../../contracts/familyTree";
import {
  FamilyTreePageSubmitterProps,
  FamilyTreePageSubmitterState
} from "../familyTreePageSubmitter/familyTreePageSubmitter";
import {PersonNode} from "../../contracts/personNode";

export interface FamilyTreePageMotherProps  extends WithTranslation {}

export interface FamilyTreePageMotherState {
  familyTree?: FamilyTree;
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
    this.setState({ familyTree: loadOrCreateTree() });

    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  componentDidUpdate(prevProps: Readonly<FamilyTreePageMotherProps>, prevState: Readonly<FamilyTreePageMotherState>) {
    if (prevState.familyTree !== this.state.familyTree && this.state.familyTree) {
      saveTree(this.state.familyTree);
    }
  }

  formChangeHandler(person: PersonNode, formData: PersonDetailsFormState) {
    const familyTree = {...this.state.familyTree} as FamilyTree;
    Object.assign(person, formData);
    this.setState({
      familyTree
    });
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
        {this.state.familyTree && <div className="family-tree-body page-content-container ">
          <PersonDetailsForm
            idPrefix="mother"
            title={t("familyTreePageMother.familyTreeCurrentEntity", "אמא")}
            displayIsAlive
            displayMaidenName
            defaults={this.state.familyTree.submitter.mother!}
            defaultGender="female"
            onFormChange={(state: PersonDetailsFormState) => {
              this.formChangeHandler(this.state.familyTree!.submitter.mother!, state);
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
            defaults={this.state.familyTree.submitter.mother?.mother!}
            defaultGender={"female"}
            onFormChange={(state: PersonDetailsFormState) => {
              this.formChangeHandler(this.state.familyTree!.submitter.mother?.mother!, state);
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
            defaults={this.state.familyTree.submitter.mother?.father!}
            defaultGender={"male"}
            onFormChange={(state: PersonDetailsFormState) => {
              this.formChangeHandler(this.state.familyTree!.submitter.mother?.father!, state);
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
        </div>}
      </div>
    );
  }
}

const FamilyTreePageMother = withTranslation()(FamilyTreePageMotherComponent);
export { FamilyTreePageMother };
