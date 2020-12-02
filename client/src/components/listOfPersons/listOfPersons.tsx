import React, {Component} from 'react';
import {Trans, withTranslation, WithTranslation} from "react-i18next";
import {PersonDetailsForm, PersonDetailsFormState} from "../personDetailsForm/personDetailsForm";
import {createPersonDetails} from "../../familyTreeService";

export interface ListOfPersonsProps extends WithTranslation {
  idPrefix: string;
  label: string;
  formLabel: string;
  persons: PersonDetailsFormState[];
  onValidityChanged: (validity: boolean) => void;
  onChange: (persons: PersonDetailsFormState[]) => void;
  displaySecondParent: boolean;
}

export interface ListOfPersonsState {
  formsValidity: boolean[]; // dictionary with key of type string and value of type boolean
  personsDetails: PersonDetailsFormState[];
}

class ListOfPersonsComponent extends Component<ListOfPersonsProps, ListOfPersonsState> {
  constructor(props: Readonly<ListOfPersonsProps>) {
    super(props);

    this.state = {
      formsValidity: this.props.persons.map(_ => false),
      personsDetails: this.props.persons
    }
  }

  componentDidUpdate(prevProps: Readonly<ListOfPersonsProps>, prevState: Readonly<ListOfPersonsState>) {
    if (this.state.personsDetails !== prevState.personsDetails) {
      this.props.onChange(this.state.personsDetails);
    }
    if (this.state.formsValidity !== prevState.formsValidity) {
      this.props.onValidityChanged(
        // If find returns undefined this means that the form validity array contains only "true" values
        this.state.formsValidity.find(formValidity => !formValidity) === undefined);
    }
  }

  render() {
    const t = this.props.t;
    return (
      <div>
        <div className={"siblings-container"}>
          <div className={"siblings-body"}>
            {this.props.label}
            <div className={"siblings-buttons"}>
              <button
                className={"increase-button"}
                tabIndex={0}
                type={"button"}
                title={t("familyTreePageSiblings.familyTreeSiblingsIncreaseNumber", "להגדיל מספר אחים או אחיות באחד")}
                onClick={(event) => {
                  this.setState((prevState) =>
                    ({personsDetails: [
                      ...prevState.personsDetails,
                      {...createPersonDetails(), isSubmitter: false}
                    ]}));
                }}
              >+
              </button>
              <div className={"number-of-siblings"}>{this.state.personsDetails.length < 1 ? '-' : this.state.personsDetails.length}</div>
              <button
                className={`decrease-button ${this.state.personsDetails.length < 1 ? "disabled-button" : ""}`}
                tabIndex={1}
                type={"button"}
                title={t("familyTreePageSiblings.familyTreeSiblingsDecreaseNumber", "להפחית מספר אחים או אחיות באחד")}
                onClick={(event) => {
                  if (this.state.personsDetails.length > 0) {
                    this.setState((prevState) => ({personsDetails: prevState.personsDetails.slice(0, -1)}));
                  }
                }}
              >-
              </button>
            </div>
          </div>
        </div>
        <div className="family-tree-body">
          {this.state.personsDetails.map((personDetails, index) => {
            return (
              <React.Fragment
                key={`${this.props.idPrefix}${index}`}>
                <PersonDetailsForm
                  idPrefix={`${this.props.idPrefix}${index}`}
                  title={this.props.formLabel}
                  displayIsAlive
                  displayMaidenName
                  defaults={personDetails}
                  onFormChange={(state: PersonDetailsFormState) => {
                    let newPersonsState = [...this.state.personsDetails];
                    newPersonsState[index] = state;
                    this.setState(
                      {personsDetails: newPersonsState}
                    );
                  }}
                  onFormValidityChange={(isValid: boolean) => {
                    let newFormValidity = [...this.state.formsValidity];
                    newFormValidity[index] = isValid;
                    this.setState({
                      formsValidity: newFormValidity
                    });
                  }}
                />
                {this.props.displaySecondParent &&
                <>
                  <PersonDetailsForm
                    idPrefix={`${this.props.idPrefix}${index}_relatedPerson`}
                    // title={this.props.formLabel}
                    title={t("listOfPersons.secondParentLabel", "הורה נוסף")}
                    displayIsAlive
                    displayMaidenName
                    defaults={personDetails.relatedPerson}
                    onFormChange={(state: PersonDetailsFormState) => {
                      let newPersonsState = [...this.state.personsDetails];
                      newPersonsState[index] = {...newPersonsState[index]};
                      newPersonsState[index].relatedPerson = state;
                      this.setState({personsDetails: newPersonsState});
                    }}
                    onFormValidityChange={() => {
                      // Future implementation
                    }}
                  />
                </>}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    );
  }
}

const ListOfPersons = withTranslation()(ListOfPersonsComponent);
export { ListOfPersons };
