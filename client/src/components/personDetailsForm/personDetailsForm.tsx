import * as React from "react";
import axios from "axios";
import { TextInput } from "../textInput/textInput";
import _ from "lodash";
import "./personDetailsForm.css";

export interface PersonDetailsFormProps {
  idPrefix: string;
  displayIsAlive?: boolean;
  displayMaidenName?: boolean;
  title: string;
  isSubmitter?: boolean;

  defaults?: PersonDetailsFormState;
  onFormChange: (state: PersonDetailsFormState) => void;
  onFormValidityChange: (isValid: boolean) => void;
}

export interface PersonDetailsFormState {
  image: string | null;
  firstName: string | null;
  lastName: string | null;
  maidenName: string | null;
  birthDate: string | null;
  birthPlace: string | null;
  gender: string | null;
  motherID: string | null;
  fatherID: string | null;
  isAlive: boolean | null;
  deathPlace: string | null;
  deathDate: string | null;
  isSubmitter: boolean;
}

class PersonDetailsForm extends React.Component<
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
      gender: null,
      birthDate: null,
      birthPlace: null,
      motherID: null,
      fatherID: null,
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
    if (!matchFullDate && !matchYear) {
      return false;
    }
    return true;
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

  imageChangeHandler(event: React.ChangeEvent<HTMLInputElement>) {
    let fileList = event.target.files;
    if (fileList && fileList.length > 0) {
      let image = fileList[0];
      if (image) {
        this.setState({ image: "" });
        axios
          .post<{
            resizedImageB64: string;
          }>("/api/resize-image/", image)
          .then(response => {
            if (response && response.data && response.data.resizedImageB64) {
              this.setState({ image: response.data.resizedImageB64 });
            }
          });
      }
    }
  }

  render() {
    return (
      <div className="person-details-container">
        <div className="person-details">
          <form>
            <div className="person-details-header">
              <span>{this.props.title}:</span>
              <div className="image-input">
                <label htmlFor={`${this.props.idPrefix}_person`}>
                  הוסיפו תמונה
                </label>
                <input
                  onChange={this.imageChangeHandler.bind(this)}
                  id={`${this.props.idPrefix}_person`}
                  className="person-details-image-input"
                  type="file"
                  placeholder="הוסיפו תמונה"
                  accept="image/jpeg"
                />
                <div className="image-location">
                  {this.state.image && (
                    <img src={`data:image/jpeg;base64,${this.state.image}`} />
                  )}
                </div>
              </div>
            </div>
            <div className="person-details-inner-container">
              <TextInput
                defaultValue={this.state.firstName ? this.state.firstName : ""}
                title="שם פרטי"
                id={`${this.props.idPrefix}_firstName`}
                type="text"
                placeholder="לחצו להוספה"
                onChange={event => {
                  this.setState({ firstName: event.target.value });
                }}
              />
              <TextInput
                defaultValue={this.state.lastName ? this.state.lastName : ""}
                title="שם משפחה"
                id={`${this.props.idPrefix}_lastName`}
                type="text"
                placeholder="לחצו להוספה"
                onChange={event => {
                  this.setState({ lastName: event.target.value });
                }}
              />
              {this.props.displayMaidenName && (
                <TextInput
                  defaultValue={
                    this.state.maidenName ? this.state.maidenName : ""
                  }
                  title="שם נעורים"
                  id={`${this.props.idPrefix}_maidenName`}
                  type="text"
                  placeholder="לחצו להוספה"
                  onChange={event => {
                    this.setState({ maidenName: event.target.value });
                  }}
                />
              )}
              <div className="gender">
                <div className="gender-options">מין</div>
                <div className="gender-options-buttons">
                  <label htmlFor={`${this.props.idPrefix}_male`}>זכר</label>
                  <input
                    checked={this.state.gender === "male"}
                    type="radio"
                    id={`${this.props.idPrefix}_male`}
                    name="gender"
                    value="male"
                    onChange={event => {
                      this.setState({ gender: event.target.value });
                    }} />
                  <label htmlFor={`${this.props.idPrefix}_female`}>נקבה</label>
                  <input
                    checked={this.state.gender === "female"}
                    type="radio"
                    id={`${this.props.idPrefix}_female`}
                    name="gender"
                    value="female"
                    onChange={event => {
                      this.setState({ gender: event.target.value });
                    }} />
                  <label htmlFor={`${this.props.idPrefix}_other`}>אחר</label>
                  <input
                    checked={this.state.gender === "other"}
                    type="radio"
                    id={`${this.props.idPrefix}_other`}
                    name="gender"
                    value="other"
                    onChange={event => {
                      this.setState({ gender: event.target.value });
                    }} />
                </div>
              </div>
              <TextInput
                validateRegex={/^(\d{2}\/\d{2}\/\d{4}|[0-9]{4})$/}
                defaultValue={this.state.birthDate ? this.state.birthDate : ""}
                title="תאריך לידה"
                id={`${this.props.idPrefix}_birthDate`}
                type="text"
                placeholder="YYYY או DD/MM/YYYY"
                onChange={event => {
                  this.setState({ birthDate: event.target.value });
                }}
              />
              <TextInput
                defaultValue={
                  this.state.birthPlace ? this.state.birthPlace : ""
                }
                title="מקום לידה"
                id={`${this.props.idPrefix}_birthPlace`}
                type="text"
                placeholder="עיר או/ו מדינה"
                onChange={event => {
                  this.setState({ birthPlace: event.target.value });
                }}
              />
              {this.props.displayIsAlive && (
                <div className="alive-checkbox">
                  <label htmlFor={`${this.props.idPrefix}_isAlive`}>
                    חי/חיה
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
                <TextInput
                  validateRegex={/^(\d{2}\/\d{2}\/\d{4}|[0-9]{4})$/}
                  defaultValue={
                    this.state.deathDate ? this.state.deathDate : ""
                  }
                  title="תאריך פטירה"
                  id={`${this.props.idPrefix}_deathDate`}
                  type="text"
                  placeholder="YYYY או DD/MM/YYYY"
                  onChange={event => {
                    this.setState({ deathDate: event.target.value });
                  }}
                />
              )}
              {!this.state.isAlive && (
                <TextInput
                  defaultValue={
                    this.state.deathPlace ? this.state.deathPlace : ""
                  }
                  title="מקום פטירה"
                  id={`${this.props.idPrefix}_deathPlace`}
                  type="text"
                  placeholder="עיר או/ו מדינה"
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

export { PersonDetailsForm };
