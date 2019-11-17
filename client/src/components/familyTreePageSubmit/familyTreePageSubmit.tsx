import axios from "axios";
import { History } from "history";
import * as React from "react";
import { withRouter } from "react-router-dom";
import { toast } from "react-toastify";

import { Header } from "../header/header";
import { PersonDetailsFormState } from "../personDetailsForm/personDetailsForm";
import { Loader } from "../loader/loader";

import "./familyTreePageSubmit.css";

export interface FamilyTreePageSubmitProps {
  history?: History;
}

export interface FamilyTreePageSubmitState {
  httpRequestInProgress: boolean;
}

interface FamilyTreePersonJson extends PersonDetailsFormState {
  ID: string;
  siblings: string[];
}

type FamilyTreeJson = { [key: string]: FamilyTreePersonJson };

class FamilyTreePageSubmitComponent extends React.Component<
  FamilyTreePageSubmitProps,
  FamilyTreePageSubmitState
> {
  state = {
    httpRequestInProgress: false
  };

  clearStoredFamilyTreeData() {
    localStorage.clear();
  }

  returnButtonHandler() {
    this.props.history!.push("/family-tree/me");
  }

  getStoredPersonDetails(key: string): PersonDetailsFormState | null {
    let item = localStorage.getItem(key);
    if (item) {
      let bla: PersonDetailsFormState = JSON.parse(item);
      delete bla.deathDate;
      delete bla.deathPlace;
      return bla;
    }
    return null;
  }

  getStoredNumOfSiblings(): number {
    let item = localStorage.getItem("numOfSiblings");
    let numOfSiblings = 0;
    if (item) {
      numOfSiblings = parseInt(item);
    }
    return numOfSiblings;
  }

  submitButtonHandler() {
    if (this.state.httpRequestInProgress) {
      return;
    }

    let submitterDetails = this.getStoredPersonDetails("submitterDetails");
    let motherDetails = this.getStoredPersonDetails("motherDetails");
    let motherOfMotherDetails = this.getStoredPersonDetails(
      "motherOfMotherDetails"
    );
    let fatherOfMotherDetails = this.getStoredPersonDetails(
      "fatherOfMotherDetails"
    );
    let fatherDetails = this.getStoredPersonDetails("fatherDetails");
    let motherOfFatherDetails = this.getStoredPersonDetails(
      "motherOfFatherDetails"
    );
    let fatherOfFatherDetails = this.getStoredPersonDetails(
      "fatherOfFatherDetails"
    );

    let numOfSiblings = this.getStoredNumOfSiblings();
    let siblingsDetails: PersonDetailsFormState[] = [];
    for (let i = 0; i < numOfSiblings; i++) {
      let siblingKey = `sibling${i}`;
      let sibling = this.getStoredPersonDetails(siblingKey);
      if (sibling) {
        siblingsDetails.push(sibling);
      }
    }

    let familyTreeJson: FamilyTreeJson = {};
    familyTreeJson["1"] = {
      ...submitterDetails!,
      ID: "1",
      motherID: "2",
      fatherID: "5",
      siblings: []
    };
    familyTreeJson["2"] = {
      ...motherDetails!,
      ID: "2",
      motherID: "3",
      fatherID: "4",
      siblings: []
    };
    familyTreeJson["3"] = {
      ...motherOfMotherDetails!,
      ID: "3",
      motherID: null,
      fatherID: null,

      siblings: []
    };
    familyTreeJson["4"] = {
      ...fatherOfMotherDetails!,
      ID: "4",
      motherID: null,
      fatherID: null,
      siblings: []
    };
    familyTreeJson["5"] = {
      ...fatherDetails!,
      ID: "5",
      motherID: "6",
      fatherID: "7",
      siblings: []
    };
    familyTreeJson["6"] = {
      ...motherOfFatherDetails!,
      ID: "6",
      motherID: null,
      fatherID: null,
      siblings: []
    };
    familyTreeJson["7"] = {
      ...fatherOfFatherDetails!,
      ID: "7",
      motherID: null,
      fatherID: null,
      siblings: []
    };

    let nextId = 8;
    siblingsDetails.forEach((sibling, index) => {
      let key = `${nextId + index}`;
      familyTreeJson[key] = {
        ...sibling,
        ID: key,

        motherID: "2",
        fatherID: "5",
        siblings: []
      };
      familyTreeJson["1"].siblings.push(key);
    });

    this.setState({ httpRequestInProgress: true });
    axios
      .post("/api/family-tree/", familyTreeJson)
      .then(() => {
        this.clearStoredFamilyTreeData();
        this.props.history!.push("/thank-you");
      })
      .catch(error => {
        toast.error("השליחה נכשלה, נא צור קשר עם בית התפוצות");
        return Promise.reject(error);
      })
      .finally(() => {
        this.setState({ httpRequestInProgress: false });
      });
  }

  render() {
    return (
      <div className="family-tree-submit-container">
        {this.state.httpRequestInProgress && <Loader />}
        <Header title="סיימת את בניית עץ המשפחה שלך" />
        <div className="family-tree-submit-body page-content-container">
          <div className="pre-submittion-text">
            זהו סיימת את בניית העץ, רוצה לעבור על הפרטים שמילאת, ולבדוק שאין
            שגיאה?
          </div>
          <div className="choose-option">
            <button
              onClick={this.returnButtonHandler.bind(this)}
              className="option-yes option-button"
            >
              חזרה
            </button>
            <button
              disabled={this.state.httpRequestInProgress}
              onClick={this.submitButtonHandler.bind(this)}
              className="option-no option-button"
            >
              שליחה
            </button>
          </div>
        </div>
      </div>
    );
  }
}

const FamilyTreePageSubmit = (withRouter(
  FamilyTreePageSubmitComponent as any
) as any) as React.ComponentClass<FamilyTreePageSubmitProps>;
export { FamilyTreePageSubmit };
