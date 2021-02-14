import * as React from "react";
import "./familyTreePageSubmitter.scss";
import { Header } from "../header/header";
import {
  PersonDetailsForm,
  PersonDetailsFormState
} from "../personDetailsForm/personDetailsForm";
import { ProceedButton } from "../proceedButton/proceedButton";
import {Trans, WithTranslation, withTranslation} from 'react-i18next';
import {FamilyTree} from "../../contracts/familyTree";
import {loadOrCreateTree, saveTree} from "../../familyTreeService";

export interface FamilyTreePageSubmitterProps extends WithTranslation {}

export interface FamilyTreePageSubmitterState {
  familyTree?: FamilyTree;
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
    this.setState({ familyTree: loadOrCreateTree() });
  }

  componentDidUpdate(prevProps: Readonly<FamilyTreePageSubmitterProps>, prevState: Readonly<FamilyTreePageSubmitterState>) {
    if (prevState.familyTree !== this.state.familyTree && this.state.familyTree) {
      saveTree(this.state.familyTree);
    }
  }

  formChangeHandler(formData: PersonDetailsFormState) {
    const familyTree = {...this.state.familyTree} as FamilyTree;
    Object.assign(familyTree.submitter, formData);
    this.setState({
      familyTree
    });
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
          {this.state.familyTree && <PersonDetailsForm
            isSubmitter={true}
            defaults={this.state.familyTree.submitter}
            onFormChange={(state: PersonDetailsFormState) => {
              this.formChangeHandler(state);
            }}
            onFormValidityChange={this.formValidityHandler.bind(this)}
            idPrefix="me"
            title={t("familyTreePageSubmitter.familyTreeCurrentEntity", "אני")}
          />}
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
