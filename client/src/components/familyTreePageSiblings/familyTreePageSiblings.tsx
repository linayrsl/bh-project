import * as React from "react";
import { Header } from "../header/header";
import { TextInput } from "../textInput/textInput";
import "./familyTreePageSiblings.scss";
import {
  PersonDetailsForm,
  PersonDetailsFormState
} from "../personDetailsForm/personDetailsForm";
import { ProceedButton } from "../proceedButton/proceedButton";

export interface FamilyTreePageSiblingsProps {}

export interface FamilyTreePageSiblingsState {
  formsValidity: { [key: string]: boolean }; // dictionary with key of type string and value of type boolean
  numOfSiblings: number;
  siblingsDetails: { [key: string]: PersonDetailsFormState };
}

class FamilyTreePageSiblings extends React.Component<
  FamilyTreePageSiblingsProps,
  FamilyTreePageSiblingsState
> {
  state = {
    formsValidity: {} as {
      [key: string]: boolean;
    } /* default value is empty dict */,
    numOfSiblings: -1,
    siblingsDetails: {} as {
      [key: string]: PersonDetailsFormState;
    }
  };

  componentDidMount() {
    let item = localStorage.getItem("numOfSiblings");
    let numOfSiblings = -1;
    if (item) {
      numOfSiblings = parseInt(item);
    }
    this.setState({ numOfSiblings: numOfSiblings });

    let siblingsDetails = {} as {
      [key: string]: PersonDetailsFormState;
    };

    if (numOfSiblings >= 0) {
      for (let i = 0; i < numOfSiblings; i++) {
        let siblingKey = `sibling${i}`;
        item = localStorage.getItem(siblingKey);
        if (item) {
          let siblingFormData = JSON.parse(item);
          siblingsDetails[siblingKey] = siblingFormData;
        }
      }
    }

    this.setState({ siblingsDetails: siblingsDetails });

    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  componentDidUpdate(
    prevProps: FamilyTreePageSiblingsProps,
    prevState: FamilyTreePageSiblingsState
  ) {
    if (prevState.numOfSiblings !== this.state.numOfSiblings) {
      localStorage.setItem(
        "numOfSiblings",
        this.state.numOfSiblings.toString()
      ); // Saving current number of siblings to local storage

      let numOfSiblings = this.state.numOfSiblings;
      let newFormsValidity = { ...this.state.formsValidity }; // Making copy of dict in state with all data

      if (prevState.numOfSiblings < numOfSiblings) {
        for (let i = 0; i < numOfSiblings; i++) {
          let siblingId = `sibling${i}`;
          if (!(siblingId in newFormsValidity)) {
            newFormsValidity[siblingId] = false;
          }
        }
      } else {
        for (let i = numOfSiblings; i < prevState.numOfSiblings; i++) {
          let siblingId = `sibling${i}`;
          delete newFormsValidity[siblingId];
        }
      }

      this.setState({ formsValidity: newFormsValidity });
    }
  }

  formChangeHandler(formName: string, state: PersonDetailsFormState) {
    localStorage.setItem(formName, JSON.stringify(state));
  }

  render() {
    return (
      <div className="family-tree-container">
        <Header title="אחים ואחיות  4/4" />
        <div className="progress-scale">
          <div className="level active">1</div>
          <div className="level active">2</div>
          <div className="level active">3</div>
          <div className="level active">4</div>
        </div>
        <div className="page-content-container">
          <div className={"siblings-container"}>
            <div className={"siblings-body"}>
              כמה אחים ואחיות יש לך ?
              <div className={"siblings-buttons"}>
                <button
                  className={"increase-button"}
                  tabIndex={0}
                  type={"button"}
                  title={"להגדיל מספר אחים או אחיות באחד"}
                  onClick={(event) => {
                    console.log(event.target);
                    this.setState((prevState) => ({numOfSiblings: prevState.numOfSiblings+1}));
                  }}
                >+</button>
                <div className={"number-of-siblings"}>{this.state.numOfSiblings < 0 ? '-' : this.state.numOfSiblings}</div>
                <button
                  className={`decrease-button ${this.state.numOfSiblings < 1 ? "disabled-button" : ""}`}
                  tabIndex={1}
                  type={"button"}
                  title={"להפחית מספר אחים או אחיות באחד"}
                  onClick={(event) => {
                    if (this.state.numOfSiblings > 0) {
                      this.setState((prevState) => ({numOfSiblings: prevState.numOfSiblings-1}));
                    }
                  }}
                >-</button>
              </div>
            </div>
          </div>
          <div className="family-tree-body">
            {Object.keys(this.state.formsValidity).map(siblingId => {
              return (
                <PersonDetailsForm
                  key={siblingId}
                  idPrefix={siblingId}
                  title="אח/אחות"
                  displayIsAlive
                  displayMaidenName
                  defaults={this.state.siblingsDetails[siblingId]}
                  onFormChange={(state: PersonDetailsFormState) => {
                    this.formChangeHandler(siblingId, state);
                  }}
                  onFormValidityChange={(isValid: boolean) => {
                    let newFormsValidity = { ...this.state.formsValidity }; // Making copy of dict in state with all data
                    newFormsValidity[siblingId] = isValid;
                    this.setState({
                      formsValidity: newFormsValidity
                    });
                  }}
                />
              );
            })}
          </div>
          <div className="vertical-spacer"></div>
          <div className="family-tree-footer">
            <ProceedButton
              disabled={
                Object.values(this.state.formsValidity).indexOf(false) >= 0 || this.state.numOfSiblings < 0
              } // This expression return true if at least 1 of values in formsValidity dict is falsey
              text="לסיום הקישו כאן"
              nextPageUrl="/family-tree/submit"
            />
          </div>
        </div>
      </div>
    );
  }
}

export { FamilyTreePageSiblings };
