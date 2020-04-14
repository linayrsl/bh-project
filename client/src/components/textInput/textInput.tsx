import * as React from "react";


import "./textInput.css";

export interface TextInputProps {
  id: string;
  defaultValue?: string;
  title: string;
  className?: string;
  type: string;
  placeholder: string;
  required?: boolean;
  validateRegex?: RegExp;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  validationErrorMessage?: string;
}

export interface TextInputState {
  isValid: boolean;
}

class TextInput extends React.Component<TextInputProps, TextInputState> {
  constructor(props: TextInputProps) {
    super(props);
    this.state = {
      isValid: true
    };
  }

  componentDidMount() {
    if (this.props.defaultValue) {
      this.validateInput(this.props.defaultValue);
    }
  }

  validateInput(value: string) {
    if (!this.props.validateRegex) {
      return;
    }
    if (!value || value.match(this.props.validateRegex)) {
      this.setState({ isValid: true });
    } else {
      this.setState({ isValid: false });
    }
  }

  render() {
    return (
      <div
        className={`${this.props.className || ""} ${
          this.state.isValid ? "" : "invalid"
        } text-input-container`}
      >
        <label htmlFor={this.props.id}>
          {this.props.required &&
          <span className={"mandatory-field-indicator"}>*</span>}
          {this.props.title}
        </label>
        <input
          defaultValue={this.props.defaultValue}
          onChange={event => {
            this.validateInput(event.target.value);
            this.props.onChange(event);
          }}
          id={this.props.id}
          type={this.props.type}
          placeholder={this.props.placeholder}
        />
        {!this.state.isValid && <div className={"invalid-input-feedback"}>{this.props.validationErrorMessage}</div>}
      </div>
    );
  }
}

export { TextInput };
