import React, {Component} from 'react';
import {withTranslation, WithTranslation} from "react-i18next";
import {PersonDetailsForm, PersonDetailsFormState} from "../personDetailsForm/personDetailsForm";
import {ListOfPersons} from "../listOfPersons/listOfPersons";
import {CoParent} from "../../contracts/coParent";
import "./coParentForm.scss";

export interface CoParentFormProps extends WithTranslation {
  idPrefix: string;
  coParent: CoParent;
  onValidityChanged: (validity: boolean) => void;
  onChange: (coParent: CoParent) => void;
}

export interface CoParentFormState {
  parentFormValidity: boolean;
  childrenFormsValidity: boolean;
  coParent: CoParent;
}

class CoParentFormComponent extends Component<CoParentFormProps, CoParentFormState> {
  constructor(props: CoParentFormProps) {
    super(props);
    this.state = {
      parentFormValidity: true,
      childrenFormsValidity: true,
      coParent: props.coParent
    }
  }

  componentDidUpdate(prevProps: Readonly<CoParentFormProps>, prevState: Readonly<CoParentFormState>) {
    if (this.state.coParent !== prevState.coParent) {
      this.props.onChange(this.state.coParent);
    }
    if (this.state.parentFormValidity !== prevState.parentFormValidity || this.state.childrenFormsValidity !== prevState.childrenFormsValidity) {
      this.props.onValidityChanged(this.state.parentFormValidity && this.state.childrenFormsValidity)
    }
  }

  render() {
    const t = this.props.t;
    return (
      <div className={"coParents-container"}>
        <div>
          <PersonDetailsForm
            idPrefix={`${this.props.idPrefix}`}
            title={t("coParents.coParentFormTitle", "הורה נוסף")}
            displayIsAlive
            displayMaidenName
            defaults={this.state.coParent}
            onFormChange={(state: PersonDetailsFormState) => {
              let newCoParentState = {...this.state.coParent, ...state};
              this.setState(
                {coParent: newCoParentState}
              );
            }}
            onFormValidityChange={(isValid: boolean) => {
              this.setState({
                parentFormValidity: isValid
              });
            }}
          >
          </PersonDetailsForm>
          {this.state.coParent && <ListOfPersons
            label={t("coParents.sharedChildrenLabel", "?כמה ילדים/ות משותפים/ות יש לכם/ן")}
            formLabel={t("coParents.sharedChildrenFormLabel", "ילד/ילדה")}
            idPrefix={"sharedChildren"}
            onChange={(sharedChildren: PersonDetailsFormState[]) => {
              let newCoParentState = {...this.state.coParent};
              newCoParentState.sharedChildren =
                sharedChildren.map(child => ({...child, mother: null, father: null, siblings: null}));
              this.setState({
                coParent: newCoParentState
              });
            }}
            onValidityChanged={(validity) => {
              this.setState({
                childrenFormsValidity: validity
              });
            }}
            persons={this.state.coParent.sharedChildren}
          />}
        </div>
      </div>
    );
  }
}

const CoParentForm =  withTranslation()(CoParentFormComponent);
export { CoParentForm };
