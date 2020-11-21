import * as React from "react";
import { Header } from "../header/header";
import "./familyTreePageSiblings.scss";
import {
  PersonDetailsFormState
} from "../personDetailsForm/personDetailsForm";
import { ProceedButton } from "../proceedButton/proceedButton";
import {WithTranslation, withTranslation} from 'react-i18next';
import { ListOfPersons } from "../listOfPersons/listOfPersons";
import {loadOrCreateTree, saveTree} from "../../familyTreeService";
import {FamilyTree} from "../../contracts/familyTree";


export interface FamilyTreePageSiblingsProps extends WithTranslation {}

export interface FamilyTreePageSiblingsState {
  familyTree?: FamilyTree;
  siblingsFormValid: boolean;
  childrenFormValid: boolean;
  siblingsDetails: { [key: string]: PersonDetailsFormState };
}

class FamilyTreePageSiblingsComponent extends React.Component<
  FamilyTreePageSiblingsProps,
  FamilyTreePageSiblingsState
> {
  constructor(props: FamilyTreePageSiblingsProps) {
    super(props);
    this.state = {
      siblingsFormValid: true,
      childrenFormValid: true,
      siblingsDetails: {} as {
        [key: string]: PersonDetailsFormState;
      }
    }
  }

  componentDidMount() {
    this.setState({ familyTree: loadOrCreateTree() });

    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  componentDidUpdate(prevProps: Readonly<FamilyTreePageSiblingsProps>, prevState: Readonly<FamilyTreePageSiblingsState>) {
    if (prevState.familyTree !== this.state.familyTree && this.state.familyTree) {
      saveTree(this.state.familyTree);
    }
  }

  render() {
    const t = this.props.t;
    return (
      <div className="family-tree-container">
        <Header title={t("familyTreePageSiblings.header", "אחים/אחיות  4/4")} />
        <div className="progress-scale">
          <div className="level active">1</div>
          <div className="level active">2</div>
          <div className="level active">3</div>
          <div className="level active">4</div>
        </div>
        <div className="page-content-container">
          {this.state.familyTree && <ListOfPersons
            label={t("familyTreePageSiblings.familyTreeSiblingsMessage", "כמה אחים/אחיות יש לך ?")}
            formLabel={t("familyTreePageSiblings.familyTreeCurrentEntity", "אח/אחות")}
            idPrefix="siblings"
            onChange={(siblings) => {
              const familyTree = {...this.state.familyTree} as FamilyTree;
              familyTree.submitter.siblings =
                siblings.map(sibling => ({...sibling, mother: null, father: null, siblings: null}));
              this.setState({
                familyTree
              });
            }}
            onValidityChanged={(validity) => {
              this.setState({
                siblingsFormValid: validity
              });
            }}
            persons={this.state.familyTree?.submitter.siblings!}
          />}
          <div className="vertical-space" />
          {this.state.familyTree && <ListOfPersons
            label={t("familyTreePageSiblings.familyTreeChildrenMessage", "כמה ילדים יש לך ?")}
            formLabel={t("familyTreePageSiblings.familyTreeCurrentEntityChild", "ילד/ילדה")}
            idPrefix="children"
            onChange={(children) => {
              const familyTree = {...this.state.familyTree} as FamilyTree;
              familyTree.submitter.children =
                children.map(child => ({...child, mother: null, father: null, siblings: null}));
              this.setState({
                familyTree
              });
            }}
            onValidityChanged={(validity) => {
              this.setState({
                childrenFormValid: validity
              });
            }}
            persons={[]}
          />}
          <div className="vertical-spacer"></div>
          <div className="family-tree-footer">
            <ProceedButton
              disabled={
                !this.state.siblingsFormValid || !this.state.childrenFormValid
              }
              text={t("familyTreePageSiblings.familyTreeSiblingsProceedButton", "לסיום הקישו כאן")}
              nextPageUrl="/family-tree/submit"
            />
          </div>
        </div>
      </div>
    );
  }
}

const FamilyTreePageSiblings = withTranslation()(FamilyTreePageSiblingsComponent);
export { FamilyTreePageSiblings };
