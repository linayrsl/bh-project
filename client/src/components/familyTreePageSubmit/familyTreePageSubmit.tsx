import * as React from "react";
import { History } from "history";
import { Header } from "../header/header";
import axios from "axios";
import "./familyTreePageSubmit.css";
import { withRouter } from "react-router-dom";
import { PersonDetailsFormState } from "../personDetailsForm/personDetailsForm";

export interface FamilyTreePageSubmitProps {
  history?: History;
}

export interface FamilyTreePageSubmitState {}

interface FamilyTreePersonJson extends PersonDetailsFormState {
  ID: string;
  siblings: string[];
}

type FamilyTreeJson = { [key: string]: FamilyTreePersonJson };

class FamilyTreePageSubmitComponent extends React.Component<
  FamilyTreePageSubmitProps,
  FamilyTreePageSubmitState
> {
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
      // @ts-ignore
      motherID: null,
      // @ts-ignore
      fatherID: null,

      siblings: []
    };
    familyTreeJson["4"] = {
      ...fatherOfMotherDetails!,
      ID: "4",
      // @ts-ignore
      motherID: null,
      // @ts-ignore
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
      // @ts-ignore
      motherID: null,
      // @ts-ignore
      fatherID: null,
      siblings: []
    };
    familyTreeJson["7"] = {
      ...fatherOfFatherDetails!,
      ID: "7",
      // @ts-ignore
      motherID: null,
      // @ts-ignore
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

    axios
      .post("/api/family-tree/", familyTreeJson)
      .finally(() => {
        this.props.history!.push("/thank-you");
      });
  }

  render() {
    return (
      <div className="family-tree-submit-container">
        <Header title="סיימת את בניית עץ המשפחה שלך" />
        <div className="family-tree-submit-body">
          <div className="pre-submittion-text">
            זהו סיימת את בניית העץ, רוצה לעבור על הפרטים שמילאת, ולבדוק שאין
            שגיאה?
          </div>
          <div className="choose-option">
            <button
              onClick={this.returnButtonHandler.bind(this)}
              className="option-yes"
            >
              חזרה
            </button>
            <button
              onClick={this.submitButtonHandler.bind(this)}
              className="option-no"
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
