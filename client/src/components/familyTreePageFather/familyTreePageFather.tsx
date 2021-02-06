import * as React from "react";
import {
  PersonDetailsFormState,
  PersonDetailsForm
} from "../personDetailsForm/personDetailsForm";
import { Header } from "../header/header";
import { ProceedButton } from "../proceedButton/proceedButton";
import {Trans, WithTranslation, withTranslation} from 'react-i18next';
import {FamilyTree} from "../../contracts/familyTree";
import {loadOrCreateTree, saveTree} from "../../familyTreeService";
import {PersonNode} from "../../contracts/personNode";
import "./familyTreePageFather.css"
import arrowIcon from "../../assets/images/arrow-up.svg";

export interface FamilyTreePageFatherProps extends WithTranslation {}

export interface FamilyTreePageFatherState {
  familyTree?: FamilyTree;
  fatherFormValid: boolean;
  motherOfFatherFormValid: boolean;
  fatherOfFatherFormValid: boolean;
  motherOfGrandmotherFormValid: boolean;
  fatherOfGrandmotherFormValid: boolean;
  motherOfGrandfatherFormValid: boolean;
  fatherOfGrandfatherFormValid: boolean;
  showParents: boolean;
  showGrandparents: boolean;
}

class FamilyTreePageFatherComponent extends React.Component<
  FamilyTreePageFatherProps,
  FamilyTreePageFatherState
> {
  constructor(props: FamilyTreePageFatherProps) {
    super(props);
    this.state = {
      fatherFormValid: false,
      motherOfFatherFormValid: true,
      fatherOfFatherFormValid: true,
      motherOfGrandmotherFormValid: true,
      fatherOfGrandmotherFormValid: true,
      motherOfGrandfatherFormValid: true,
      fatherOfGrandfatherFormValid: true,
      showParents:false,
      showGrandparents: false,
    };
  }

  componentDidMount() {
    this.setState({ familyTree: loadOrCreateTree() });

    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  componentDidUpdate(prevProps: Readonly<FamilyTreePageFatherProps>, prevState: Readonly<FamilyTreePageFatherState>) {
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
        <Header title={t("familyTreePageFather.header", "הצד של אבא  3/4")} />
        <div className="progress-scale">
          <div className="level active">1</div>
          <div className="level active">2</div>
          <div className="level active">3</div>
          <div className="level">4</div>
        </div>
        {this.state.familyTree && <div className="family-tree-body page-content-container ">
          <PersonDetailsForm
            idPrefix="father"
            title={t("familyTreePageFather.familyTreeCurrentEntity", "אבא")}
            displayIsAlive
            displayMaidenName
            defaults={this.state.familyTree.submitter.father!}
            defaultGender={"male"}
            onFormChange={(state: PersonDetailsFormState) => {
              this.formChangeHandler(this.state.familyTree!.submitter.father!, state);
            }}
            onFormValidityChange={(isValid: boolean) => {
              this.setState({ fatherFormValid: isValid });
            }}
          />
          <div className="fatherParentsTitle"
          role="button"
          onClick={() => this.setState({showParents: !this.state.showParents})}>
            <div className="parentsLabel">
              <img src={arrowIcon} alt ="" style={{transform: this.state.showParents ? "rotate(180deg)" : "rotate(0deg)"}}/>
            </div>
            <Trans i18nKey={"familyTreePageFather.familyTreeGrandParentsTitle"}>ההורים של אבא (סבא וסבתא)</Trans>
          </div>

          {this.state.showParents &&
          <>
            <PersonDetailsForm
              idPrefix="mother-of-father"
              title={t("familyTreePageFather.familyTreeFathersMother", "אמא של אבא")}
              displayIsAlive
              displayMaidenName
              defaults={this.state.familyTree.submitter.father?.mother!}
              defaultGender={"female"}
              onFormChange={(state: PersonDetailsFormState) => {
                this.formChangeHandler(this.state.familyTree!.submitter.father?.mother!, state);
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
              defaults={this.state.familyTree.submitter.father?.father!}
              defaultGender={"male"}
              onFormChange={(state: PersonDetailsFormState) => {
                this.formChangeHandler(this.state.familyTree!.submitter.father?.father!, state);
              }}
              onFormValidityChange={(isValid: boolean) => {
                this.setState({ fatherOfFatherFormValid: isValid });
              }}
            />
          </>}

          <div className="fatherGrandParentsTitle"
          role="button"
          onClick={() => this.setState({showGrandparents: !this.state.showGrandparents})}
          >
            <div className="parentsLabel">
              <img src={arrowIcon} alt ="" style={{transform: this.state.showGrandparents ? "rotate(180deg)" : "rotate(0deg)"}}/>
            </div>
            <Trans i18nKey={"familyTreePageFather.familyTreeGrandGrandParentsTitle"}>סבא וסבתא של אבא (סבא רבא וסבתא רבא)</Trans>
          </div>
          {this.state.showGrandparents &&
          <>
            <PersonDetailsForm
              idPrefix="mother-of-grandmother"
              title={t("familyTreePageFather.familyTreeMotherOfGrandmother", "אמא של סבתא (מצד אבא)")}
              displayIsAlive
              displayMaidenName
              defaults={this.state.familyTree.submitter.father?.mother?.mother!}
              defaultGender={"male"}
              onFormChange={(state: PersonDetailsFormState) => {
                this.formChangeHandler(this.state.familyTree!.submitter.father?.mother?.mother!, state);
              }}
              onFormValidityChange={(isValid: boolean) => {
                this.setState({ motherOfGrandmotherFormValid: isValid });
              }}
            />
            <PersonDetailsForm
              idPrefix="father-of-grandmother"
              title={t("familyTreePageFather.familyTreeFatherOfGrandmother", "אבא של סבתא (מצד אבא)")}
              displayIsAlive
              displayMaidenName
              defaults={this.state.familyTree.submitter.father?.mother?.father!}
              defaultGender={"male"}
              onFormChange={(state: PersonDetailsFormState) => {
                this.formChangeHandler(this.state.familyTree!.submitter.father?.mother?.father!, state);
              }}
              onFormValidityChange={(isValid: boolean) => {
                this.setState({ fatherOfGrandmotherFormValid: isValid });
              }}
            />
            <PersonDetailsForm
              idPrefix="mother-of-grandfather"
              title={t("familyTreePageFather.familyTreeMotherOfGrandfather", "אמא של סבא(מצד אבא)")}
              displayIsAlive
              displayMaidenName
              defaults={this.state.familyTree.submitter.father?.father?.mother!}
              defaultGender={"male"}
              onFormChange={(state: PersonDetailsFormState) => {
                this.formChangeHandler(this.state.familyTree!.submitter.father?.father?.mother!, state);
              }}
              onFormValidityChange={(isValid: boolean) => {
                this.setState({ motherOfGrandfatherFormValid: isValid });
              }}
            />
            <PersonDetailsForm
              idPrefix="father-of-grandfather"
              title={t("familyTreePageFather.familyTreeFatherOfGrandfather", "אבא של סבא(מצד אבא)")}
              displayIsAlive
              displayMaidenName
              defaults={this.state.familyTree.submitter.father?.father?.father!}
              defaultGender={"male"}
              onFormChange={(state: PersonDetailsFormState) => {
                this.formChangeHandler(this.state.familyTree!.submitter.father?.father?.father!, state);
              }}
              onFormValidityChange={(isValid: boolean) => {
                this.setState({ fatherOfGrandfatherFormValid: isValid });
              }}
            />
          </>}
        </div>}
        <div className="family-tree-footer">
          <ProceedButton
            disabled={
              !this.state.fatherFormValid ||
              !this.state.motherOfFatherFormValid ||
              !this.state.fatherOfFatherFormValid ||
              !this.state.motherOfGrandmotherFormValid ||
              !this.state.fatherOfGrandmotherFormValid ||
              !this.state.motherOfGrandfatherFormValid ||
              !this.state.fatherOfGrandfatherFormValid
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
