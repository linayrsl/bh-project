import * as React from "react";
import { Header } from "../header/header";
import "./familyTreePageSiblings.scss";
import {
  PersonDetailsFormState
} from "../personDetailsForm/personDetailsForm";
import { ProceedButton } from "../proceedButton/proceedButton";
import {Trans, WithTranslation, withTranslation} from 'react-i18next';
import { ListOfPersons } from "../listOfPersons/listOfPersons";
import {createPersonDetails, loadOrCreateTree, saveTree} from "../../familyTreeService";
import {FamilyTree} from "../../contracts/familyTree";
import {CoParentForm} from "../coParentForm/coParentForm";
import {CoParent} from "../../contracts/coParent";


export interface FamilyTreePageSiblingsProps extends WithTranslation {}

export interface FamilyTreePageSiblingsState {
  familyTree?: FamilyTree;
  siblingsFormValid: boolean;
  coParentsFormsValidity: boolean[];
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
      coParentsFormsValidity: [],
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
          <div className={"sharedChildrenLabel"}>
            <label htmlFor={"sharedChildren"} >
              <Trans i18nKey={"familyTreePageSiblings.sharedChildrenLabel"}>"האם יש לך ילדים/ות ?"</Trans>
            </label>
            <input
              type={"checkbox"}
              id={"sharedChildren"}
              onChange={() => {
                if (this.state.familyTree) {
                  const newFamilyTree = {...this.state.familyTree};

                  if (newFamilyTree.submitter.coParents?.length === 0) {
                    newFamilyTree.submitter.coParents!.push({
                      ...createPersonDetails(),
                      sharedChildren: [],
                      isSubmitter: false
                    });
                    this.setState({familyTree: newFamilyTree});
                  }
                  else {
                    newFamilyTree.submitter.coParents = [];
                    this.setState({familyTree: newFamilyTree, coParentsFormsValidity: []});
                  }
                }
              }}
              checked={!!this.state.familyTree?.submitter.coParents?.length}/>
          </div>
          {(this.state.familyTree && this.state.familyTree.submitter?.coParents) &&
          this.state.familyTree.submitter.coParents.map((coParent, index) =>
            <CoParentForm
              key={index}
              idPrefix={`coParent${index}`}
              coParent={coParent}
              onValidityChanged={(validity: boolean) => {
                const newCoParentsFormsValid = [...this.state.coParentsFormsValidity];
                newCoParentsFormsValid[index] = validity;
                this.setState({
                  coParentsFormsValidity: newCoParentsFormsValid
                });
              }}
              onChange={(coParent: CoParent) => {
                const newFamilyTree = {...this.state.familyTree!};
                newFamilyTree.submitter.coParents = [...this.state.familyTree!.submitter.coParents!];
                newFamilyTree.submitter.coParents[index] = coParent;
                this.setState({
                  familyTree: newFamilyTree
                });
              }}
            />)}
          <div className="vertical-spacer"/>
          {(this.state.familyTree?.submitter && this.state.familyTree.submitter.coParents!.length > 0) &&
          <div className={"sharedChildrenDifferentFamilyLabel"}>
            <button className={"sharedChildrenDifferentFamilyButton"}
            onClick={() => {
              if (this.state.familyTree) {
                const newFamilyTree = {...this.state.familyTree};
                newFamilyTree.submitter.coParents!.push({
                  ...createPersonDetails(),
                  sharedChildren: [],
                  isSubmitter: false
                });
                this.setState({familyTree: newFamilyTree});
              }
            }}
            >
              <Trans i18nKey={"familyTreePageSiblings.sharedChildrenDifferentFamilyLabel"}>יש לי עוד ילדים/ות מהורה אחר</Trans>
            </button>
          </div>}
          <div className="vertical-spacer"/>
          <div className="family-tree-footer">
            <ProceedButton
              disabled={
                !this.state.siblingsFormValid || this.state.coParentsFormsValidity.find(coParentForm => !coParentForm) !== undefined
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
