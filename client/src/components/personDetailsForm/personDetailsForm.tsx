import _ from "lodash";
import * as React from "react";
import { TextInput } from "../textInput/textInput";
import {ImageInput} from "../imageInput/imageInput";
import {DateInput} from "../dateInput/dateInput";
import {Gender} from "../../contracts/gender";
import {PersonDetails} from "../../contracts/personDetails";
import {Trans, WithTranslation, withTranslation} from 'react-i18next';

import "./personDetailsForm.scss";

export interface PersonDetailsFormProps extends WithTranslation {
  idPrefix: string;
  displayIsAlive?: boolean;
  displayMaidenName?: boolean;
  title: string;
  isSubmitter?: boolean;

  defaults?: PersonDetailsFormState;
  defaultGender?: Gender;
  onFormChange: (state: PersonDetailsFormState) => void;
  onFormValidityChange: (isValid: boolean) => void;
}

export interface PersonDetailsFormState extends PersonDetails {
}

class PersonDetailsFormComponent extends React.Component<
  PersonDetailsFormProps,
  PersonDetailsFormState
> {
  constructor(props: PersonDetailsFormProps) {
    super(props);

    this.state = props.defaults || {
      image: null,
      firstName: null,
      lastName: null,
      maidenName: null,
      gender: props.defaultGender || null,
      birthDate: null,
      birthPlace: null,
      isAlive: true,
      deathDate: null,
      deathPlace: null,
      isSubmitter: props.isSubmitter === true
    };
  }

  componentDidMount() {
    this.props.onFormValidityChange(this.isFormValid());
  }

  componentDidUpdate(
    prevProps: PersonDetailsFormProps,
    prevState: PersonDetailsFormState
  ) {
    if (!prevProps.defaults && this.props.defaults) {
      this.setState({ ...this.props.defaults });
    }

    if (!_.isEqual(prevState, this.state)) {
      this.props.onFormChange(this.state);
      this.props.onFormValidityChange(this.isFormValid());
    }
  }

  isDateValid(date: string): boolean {
    let pattern1 = /^\d{2}\/\d{2}\/\d{4}$/g;
    let pattern2 = /^[0-9]{4}$/g;
    let matchFullDate = date.match(pattern1);
    let matchYear = date.match(pattern2);

    return !(!matchFullDate && !matchYear);
  }

  isFormValid(): boolean {
    if (this.state.isSubmitter) {
      if (!this.state.firstName || !this.state.lastName || !this.state.gender) {
        return false;
      }
    }
    if (this.state.birthDate) {
      if (!this.isDateValid(this.state.birthDate)) {
        return false;
      }
    }

    if (this.state.deathDate) {
      if (!this.isDateValid(this.state.deathDate)) {
        return false;
      }
    }
    return true;
  }

  render() {
    const t = this.props.t;

    return (
      <div className="person-details-container">
        <div className="person-details">
          <form noValidate={true}>
            <div className="person-details-header">
              <span>{this.props.title}:</span>
              <ImageInput
                id={`${this.props.idPrefix}_person`}
                defaultValue={this.state.image || undefined}
                onChange={image => this.setState({ image: image })}/>
            </div>
            <div className="person-details-inner-container">
              <TextInput
                defaultValue={this.state.firstName ? this.state.firstName : ""}
                title={t("personDetailsForm.personDetailsName", "שם פרטי")}
                id={`${this.props.idPrefix}_firstName`}
                type="text"
                placeholder={t("personDetailsForm.personDetailsNamePlaceholder", "לחצו להוספה")}
                onChange={event => {
                  this.setState({ firstName: event.target.value });
                }}
                required={this.state.isSubmitter}
              />
              <TextInput
                defaultValue={this.state.lastName ? this.state.lastName : ""}
                title={t("personDetailsForm.personDetailsLastName", "שם משפחה")}
                id={`${this.props.idPrefix}_lastName`}
                type="text"
                placeholder={t("personDetailsForm.personDetailsLastNamePlaceholder", "לחצו להוספה")}
                onChange={event => {
                  this.setState({ lastName: event.target.value });
                }}
                required={this.state.isSubmitter}
              />
              {this.props.displayMaidenName && (
                <TextInput
                  defaultValue={
                    this.state.maidenName ? this.state.maidenName : ""
                  }
                  title={
                    this.state.gender === "male" ?
                      t("personDetailsForm.personDetailsFormerName", "שם קודם") :
                      (this.state.gender === "female" ?
                        t("personDetailsForm.personDetailsMaidenName" , "שם נעורים") :
                        t("personDetailsForm.personDetailsDefaultName", "שם נעורים/שם קודם"))}
                  id={`${this.props.idPrefix}_maidenName`}
                  type="text"
                  placeholder={t("personDetailsForm.personDetailsMaidenNamePlaceholder", "לחצו להוספה")}
                  onChange={event => {
                    this.setState({ maidenName: event.target.value });
                  }}
                />
              )}
              <div className="gender">
                <div className="gender-options">
                  {this.state.isSubmitter &&
                  <span className={"mandatory-field-indicator"}>*</span>}
                  <Trans i18nKey={"personDetailsForm.personDetailsGender"}>מין</Trans>
                </div>
                <div className="gender-options-buttons">
                  <label htmlFor={`${this.props.idPrefix}_male`}>
                    <Trans i18nKey={"personDetailsForm.personDetailsMalePlaceholder"}>זכר</Trans>
                  </label>
                  <input
                    checked={this.state.gender === "male"}
                    type="radio"
                    id={`${this.props.idPrefix}_male`}
                    name="gender"
                    value="male"
                    onChange={event => {
                      this.setState({ gender: event.target.value as Gender });
                    }} />
                  <label htmlFor={`${this.props.idPrefix}_female`}>
                   <Trans i18nKey={"personDetailsForm.personDetailsFemalePlaceholder"}> נקבה</Trans>
                  </label>
                  <input
                    checked={this.state.gender === "female"}
                    type="radio"
                    id={`${this.props.idPrefix}_female`}
                    name="gender"
                    value="female"
                    onChange={event => {
                      this.setState({ gender: event.target.value as Gender });
                    }} />
                  <label htmlFor={`${this.props.idPrefix}_other`}>
                    <Trans i18nKey={"personDetailsForm.personDetailsOtherPlaceholder"}>אחר</Trans>
                  </label>
                  <input
                    checked={this.state.gender === "other"}
                    type="radio"
                    id={`${this.props.idPrefix}_other`}
                    name="gender"
                    value="other"
                    onChange={event => {
                      this.setState({ gender: event.target.value as Gender });
                    }} />
                </div>
              </div>
              <DateInput
                defaultValue={this.state.birthDate ? this.state.birthDate : ""}
                title={t("personDetailsForm.personDetailsBirthDate", "תאריך לידה")}
                id={`${this.props.idPrefix}_birthDate`}
                onChange={value => {
                  this.setState({ birthDate: value });
                }}
              />
              <TextInput
                defaultValue={
                  this.state.birthPlace ? this.state.birthPlace : ""
                }
                title={t("personDetailsForm.personDetailsBirthPlace", "מקום לידה")}
                id={`${this.props.idPrefix}_birthPlace`}
                type="text"
                placeholder={t("personDetailsForm.personDetailsBirthPlacePlaceholder", "עיר או/ו מדינה")}
                onChange={event => {
                  this.setState({ birthPlace: event.target.value });
                }}
              />
              {this.props.displayIsAlive && (
                <div className="alive-checkbox">
                  <label htmlFor={`${this.props.idPrefix}_isAlive`}>
                    <Trans i18nKey={"personDetailsForm.personDetailsIsAlive"}>חי/חיה</Trans>
                  </label>
                  <input
                    checked={
                      this.state.isAlive === null ? true : this.state.isAlive
                    }
                    type="checkbox"
                    id={`${this.props.idPrefix}_isAlive`}
                    className="checkbox"
                    onChange={event => {
                      this.setState({ isAlive: event.target.checked });
                    }} />
                </div>
              )}
              {!this.state.isAlive && (
                <DateInput
                  defaultValue={this.state.deathDate ? this.state.deathDate : ""}
                  title={t("personDetailsForm.personDetailsDeathDate", "תאריך פטירה")}
                  id={`${this.props.idPrefix}_deathDate`}
                  onChange={value => {
                    this.setState({ deathDate: value });
                  }}
                />
              )}
              {!this.state.isAlive && (
                <TextInput
                  defaultValue={
                    this.state.deathPlace ? this.state.deathPlace : ""
                  }
                  title={t("personDetailsForm.personDetailsDeathPlace", "מקום פטירה")}
                  id={`${this.props.idPrefix}_deathPlace`}
                  type="text"
                  placeholder={t("personDetailsForm.personDetailsDeathPlacePlaceholder", "עיר או/ו מדינה")}
                  onChange={event => {
                    this.setState({ deathPlace: event.target.value });
                  }}
                />
              )}
            </div>
          </form>
        </div>
      </div>
    );
  }
}

const PersonDetailsForm = withTranslation()(PersonDetailsFormComponent);
export { PersonDetailsForm };
